
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std/encoding/base64.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib?dts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const azureApiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
const endpoint = "https://sydologie.openai.azure.com";
const deploymentName = "gpt4";

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

    // Extraire le texte du PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    let pdfContent = '';

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const textObjects = await page.doc.getPage(i + 1).getTextObjects();
      
      for (const textObj of textObjects) {
        if (typeof textObj.text === 'string') {
          pdfContent += textObj.text + ' ';
        }
      }
      pdfContent += '\n';
    }

    console.log('PDF content extracted:', pdfContent.substring(0, 200) + '...');

    const response = await fetch(`${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2023-05-15`, {
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
            content: `Sujet: ${subject}\n\nContenu: ${pdfContent}\n\nCrée un glossaire des termes techniques importants.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('Azure OpenAI API error:', await response.text());
      throw new Error('Erreur lors de la génération du glossaire');
    }

    const openAIResponse = await response.json();
    console.log('Azure OpenAI response:', openAIResponse);

    let glossaryContent;
    try {
      const content = openAIResponse.choices[0].message.content;
      glossaryContent = JSON.parse(content);
      
      // Validate response format
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
      JSON.stringify({ error: 'Une erreur est survenue lors de la génération du glossaire' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
