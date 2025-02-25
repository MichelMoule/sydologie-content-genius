
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std/encoding/base64.ts";

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
    const file = formData.get('file') as File;
    const subject = formData.get('subject') as string;

    if (!file || !subject) {
      return new Response(
        JSON.stringify({ error: 'Le fichier PDF et le sujet sont requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Récupérer le contenu du fichier
    const arrayBuffer = await file.arrayBuffer();
    const pdfContent = new TextDecoder().decode(arrayBuffer);
    
    console.log('Processing file:', file.name, 'size:', file.size);
    console.log('First 100 chars of content:', pdfContent.substring(0, 100));

    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-08-01-preview`;
    console.log('Calling Azure OpenAI at:', url);

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
            Tu dois :
            1. Identifier uniquement les termes techniques et spécifiques au domaine
            2. Fournir des définitions précises et faciles à comprendre
            3. Retourner un JSON valide avec une propriété "terms" qui est un tableau d'objets contenant "term" et "definition"
            
            Format de sortie attendu :
            {
              "terms": [
                {
                  "term": "terme technique",
                  "definition": "définition claire et concise"
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Sujet: ${subject}\n\nContenu du document:\n${pdfContent.substring(0, 4000)}\n\nCrée un glossaire des termes techniques importants.`
          }
        ],
        temperature: 0.7,
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
      const content = openAIResponse.choices[0].message.content;
      console.log('Raw content:', content);
      glossaryContent = JSON.parse(content);
      
      if (!glossaryContent.terms || !Array.isArray(glossaryContent.terms)) {
        throw new Error('Format de réponse invalide');
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Format de réponse invalide de l\'API');
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
