
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import mammoth from 'npm:mammoth@1.6.0';

const azureApiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
const endpoint = "https://sydo-chatgpt.openai.azure.com";
const deploymentName = "gpt-4o-mini-2";
const apiVersion = "2024-08-01-preview";

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
        JSON.stringify({ error: 'Le fichier et le sujet sont requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!fileType || !['txt', 'docx'].includes(fileType)) {
      return new Response(
        JSON.stringify({ error: 'Format de fichier non supporté. Veuillez utiliser un fichier .txt ou .docx' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Extract text from file
    console.log(`Extracting text from ${fileType} file...`);
    let extractedText = '';
    
    if (fileType === 'txt') {
      // For .txt files, read directly as text
      extractedText = await file.text();
    } else if (fileType === 'docx') {
      // For .docx files, use mammoth to convert to text
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
    }

    console.log(`Extracted ${extractedText.length} characters of text`);
    console.log('Text preview:', extractedText.substring(0, 200));

    // Now we have the text content, generate the glossary
    console.log('Generating glossary from extracted text');
    const glossaryUrl = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    
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
            content: `Sujet: ${subject}\n\nContenu du document:\n${extractedText}\n\nCrée un glossaire des termes techniques importants.`
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
