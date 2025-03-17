
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { corsHeaders } from "../_shared/cors.ts";

const azureApiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
const endpoint = "https://sydo-chatgpt.openai.azure.com";
const deploymentName = "gpt-4o-mini-2";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const pdfFile = formData.get('file') as File;
    const subject = formData.get('subject') as string;

    if (!pdfFile || !subject) {
      return new Response(
        JSON.stringify({ error: 'Le fichier PDF et le sujet sont requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // 1. Convert PDF file to text - using a chunk-based approach to avoid stack overflow
    const pdfArrayBuffer = await pdfFile.arrayBuffer();
    const pdfBytes = new Uint8Array(pdfArrayBuffer);
    
    // Convert Uint8Array to base64 in chunks to avoid stack overflow
    let base64Pdf = '';
    const chunkSize = 8192; // Use smaller chunks to avoid stack overflow
    for (let i = 0; i < pdfBytes.length; i += chunkSize) {
      const chunk = pdfBytes.slice(i, i + chunkSize);
      base64Pdf += btoa(String.fromCharCode.apply(null, [...chunk]));
    }
    
    console.log(`PDF converted to base64, length: ${base64Pdf.length}`);

    // Ensure proper formatting of the data URL for Azure OpenAI
    const dataUrl = `data:application/pdf;base64,${base64Pdf}`;

    // 2. Call Azure OpenAI with vision capabilities to extract text from PDF
    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-08-01-preview`;
    
    console.log('Calling Azure OpenAI for PDF extraction...');
    const pdfExtractResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureApiKey!,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extrait tout le texte de ce document PDF. Retourne UNIQUEMENT le texte extrait, sans commentaires ni formatage.' },
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl,
                }
              }
            ],
          }
        ],
        max_tokens: 4096,
      }),
    });

    if (!pdfExtractResponse.ok) {
      const error = await pdfExtractResponse.text();
      console.error('Azure OpenAI PDF extraction error:', error);
      throw new Error('Erreur lors de l\'extraction du texte du PDF');
    }

    const extractionResult = await pdfExtractResponse.json();
    const extractedText = extractionResult.choices[0].message.content;
    console.log('Extracted text preview:', extractedText.substring(0, 500));

    // 3. Generate glossary from extracted text using Azure OpenAI
    const url2 = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-08-01-preview`;
    
    // Adding a timeout for the Azure OpenAI request
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    try {
      const response = await fetch(url2, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureApiKey!,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en création de glossaires.
              Ta tâche est d'identifier les termes techniques importants dans le texte fourni et de générer des définitions claires et concises.
              
              IMPORTANT: Ta réponse DOIT être un JSON valide SANS texte additionnel avant ou après.
              Le format attendu est STRICTEMENT :
              {
                "terms": [
                  {
                    "term": "terme technique",
                    "definition": "définition claire et concise"
                  }
                ]
              }
              
              Si tu ne trouves pas de termes techniques, retourne un tableau vide : { "terms": [] }
              N'ajoute AUCUN texte avant ou après le JSON.`
            },
            {
              role: 'user',
              content: `Sujet: ${subject}\n\nContenu du document:\n${extractedText}\n\nCrée un glossaire des termes techniques importants.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Azure OpenAI API error:', errorText);
        throw new Error(`Erreur lors de la génération du glossaire: ${errorText}`);
      }

      const openAIResponse = await response.json();
      console.log('Azure OpenAI response received');

      // Safely extract and validate JSON
      let glossaryContent;
      try {
        // Get the raw content as string
        const content = openAIResponse.choices[0].message.content.trim();
        console.log('Raw content length:', content.length);
        
        // Safe JSON parsing
        try {
          // Simple approach first - direct parsing
          glossaryContent = JSON.parse(content);
        } catch (e) {
          console.log('Direct parsing failed, trying to extract JSON from content');
          
          // Try to handle markdown code blocks
          let jsonStr = content;
          if (content.includes('```json')) {
            const match = content.match(/```json\n([\s\S]*?)\n```/);
            if (match && match[1]) {
              jsonStr = match[1].trim();
            }
          }
          
          // Find JSON between curly braces
          const startIndex = jsonStr.indexOf('{');
          const endIndex = jsonStr.lastIndexOf('}');
          
          if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            jsonStr = jsonStr.substring(startIndex, endIndex + 1);
            console.log('Extracted JSON string length:', jsonStr.length);
            glossaryContent = JSON.parse(jsonStr);
          } else {
            throw new Error('No valid JSON object found in response');
          }
        }
        
        // Validate the expected format
        if (!glossaryContent.terms || !Array.isArray(glossaryContent.terms)) {
          console.error('Invalid response format:', glossaryContent);
          throw new Error('Format de réponse invalide: pas de tableau terms');
        }

        // Validate each term
        for (const term of glossaryContent.terms) {
          if (!term.term || !term.definition) {
            console.error('Invalid term format:', term);
            throw new Error('Format de terme invalide');
          }
        }
      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        throw new Error(`Format de réponse invalide de l'API: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ glossary: glossaryContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } finally {
      clearTimeout(timeout);
    }

  } catch (error) {
    console.error('Erreur dans la fonction generate-glossary:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur est survenue lors de la génération du glossaire' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
