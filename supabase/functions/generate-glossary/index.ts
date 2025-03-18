
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const azureApiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
const endpoint = "https://sydo-chatgpt.openai.azure.com";
const deploymentName = "gpt-4o-mini";

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

    // Read the PDF file content
    const fileContent = await pdfFile.text();
    console.log(`File content length: ${fileContent.length}`);

    // If the file is binary (likely a PDF), we need a different approach
    let textToProcess = fileContent;
    
    // If the content seems to be binary (not readable text)
    if (fileContent.includes('%PDF') || /[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(fileContent.substring(0, 1000))) {
      console.log('PDF detected, using Azure OpenAI vision capabilities for extraction');
      
      // Convert the file to base64 for the vision API
      const fileArrayBuffer = await pdfFile.arrayBuffer();
      const fileBytes = new Uint8Array(fileArrayBuffer);
      
      // Convert to base64 in chunks to avoid stack overflow
      let base64Pdf = '';
      const chunkSize = 8192;
      for (let i = 0; i < fileBytes.length; i += chunkSize) {
        const chunk = fileBytes.slice(i, i + chunkSize);
        base64Pdf += btoa(String.fromCharCode.apply(null, [...chunk]));
      }
      
      const dataUrl = `data:application/pdf;base64,${base64Pdf}`;
      
      // Call Azure OpenAI with vision capabilities
      const visionUrl = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`;
      
      const visionResponse = await fetch(visionUrl, {
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

      if (!visionResponse.ok) {
        const error = await visionResponse.text();
        console.error('PDF extraction error:', error);
        throw new Error('Erreur lors de l\'extraction du texte du PDF');
      }

      const extractionResult = await visionResponse.json();
      textToProcess = extractionResult.choices[0].message.content;
      console.log('Extracted text preview:', textToProcess.substring(0, 500));
    }

    // Now we have the text content, generate the glossary
    console.log('Generating glossary from text content');
    const glossaryUrl = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`;
    
    const glossaryResponse = await fetch(glossaryUrl, {
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
            content: `Sujet: ${subject}\n\nContenu du document:\n${textToProcess}\n\nCrée un glossaire des termes techniques importants.`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!glossaryResponse.ok) {
      const errorText = await glossaryResponse.text();
      console.error('Glossary generation error:', errorText);
      throw new Error(`Erreur lors de la génération du glossaire: ${errorText}`);
    }

    const openAIResponse = await glossaryResponse.json();
    console.log('Glossary response received');

    // Parse the response
    try {
      const content = openAIResponse.choices[0].message.content.trim();
      console.log('Raw content preview:', content.substring(0, 100));
      
      let glossaryContent;
      try {
        glossaryContent = JSON.parse(content);
      } catch (e) {
        console.log('Direct parsing failed, trying to extract JSON');
        
        // Try to handle markdown code blocks or extract JSON
        let jsonStr = content;
        if (content.includes('```json')) {
          const match = content.match(/```json\n([\s\S]*?)\n```/);
          if (match && match[1]) {
            jsonStr = match[1].trim();
          }
        }
        
        // Extract JSON between curly braces
        const startIndex = jsonStr.indexOf('{');
        const endIndex = jsonStr.lastIndexOf('}');
        
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonStr = jsonStr.substring(startIndex, endIndex + 1);
          glossaryContent = JSON.parse(jsonStr);
        } else {
          throw new Error('No valid JSON found in response');
        }
      }
      
      // Validate format
      if (!glossaryContent.terms || !Array.isArray(glossaryContent.terms)) {
        throw new Error('Format de réponse invalide: pas de tableau terms');
      }

      return new Response(
        JSON.stringify({ glossary: glossaryContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error(`Format de réponse invalide: ${error.message}`);
    }

  } catch (error) {
    console.error('Error in generate-glossary function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur est survenue lors de la génération du glossaire' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
