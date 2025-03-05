
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // 1. Convert PDF file to text
    const pdfArrayBuffer = await pdfFile.arrayBuffer();
    const pdfBytes = new Uint8Array(pdfArrayBuffer);
    const base64Pdf = btoa(String.fromCharCode(...pdfBytes));

    // 2. Call OpenAI to extract text from PDF
    const pdfExtractResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extrait tout le texte de ce document PDF. Retourne UNIQUEMENT le texte extrait, sans commentaires ni formatage.' },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${base64Pdf}`,
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
      console.error('OpenAI PDF extraction error:', error);
      throw new Error('Erreur lors de l\'extraction du texte du PDF');
    }

    const extractionResult = await pdfExtractResponse.json();
    const extractedText = extractionResult.choices[0].message.content;
    console.log('Extracted text preview:', extractedText.substring(0, 500));

    // 3. Generate glossary from extracted text using Azure OpenAI
    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-08-01-preview`;
    const response = await fetch(url, {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure OpenAI API error:', errorText);
      throw new Error(`Erreur lors de la génération du glossaire: ${errorText}`);
    }

    const openAIResponse = await response.json();
    console.log('Azure OpenAI response received');

    let glossaryContent;
    try {
      const content = openAIResponse.choices[0].message.content.trim();
      console.log('Raw content:', content);
      
      // Ensure we're parsing valid JSON
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      const jsonContent = content.slice(jsonStart, jsonEnd);
      
      glossaryContent = JSON.parse(jsonContent);
      
      if (!glossaryContent.terms || !Array.isArray(glossaryContent.terms)) {
        console.error('Invalid response format:', glossaryContent);
        throw new Error('Format de réponse invalide: pas de tableau terms');
      }

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

  } catch (error) {
    console.error('Erreur dans la fonction generate-glossary:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur est survenue lors de la génération du glossaire' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
