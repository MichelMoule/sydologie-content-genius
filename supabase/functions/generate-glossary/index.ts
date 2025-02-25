
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std/encoding/base64.ts";

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

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert PDF content to text
    const pdfContent = await extractTextFromPdf(uint8Array);

    // Generate glossary using Azure OpenAI
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
            content: 'Tu es un expert en création de glossaires. Tu dois identifier les termes techniques importants dans le texte fourni et générer des définitions claires et concises. Retourne toujours un JSON avec une propriété terms qui est un tableau d\'objets ayant un term et une definition.'
          },
          {
            role: 'user',
            content: `Sujet: ${subject}\n\nContenu: ${pdfContent}\n\nCrée un glossaire au format JSON avec les termes techniques et leurs définitions. Assure-toi que la sortie est un JSON valide avec une propriété "terms" qui est un tableau d'objets contenant "term" et "definition".`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const openAIResponse = await response.json();
    const glossaryContent = JSON.parse(openAIResponse.choices[0].message.content);

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

async function extractTextFromPdf(pdfBuffer: Uint8Array): Promise<string> {
  // Use pdf.js to extract text from PDF
  // For now, return a placeholder text - we'll implement the actual PDF parsing later
  return "Contenu du PDF (à implémenter)";
}
