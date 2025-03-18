
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/+esm";

const azureApiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
const endpoint = "https://sydo-chatgpt.openai.azure.com";
const deploymentName = "gpt-4o-mini-2";
const apiVersion = "2024-08-01-preview";

// Configure PDF.js for server-side usage
const pdfjsWorker = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs");
pdfjs.GlobalWorkerOptions.workerPort = new pdfjsWorker.PDFWorker();

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

    // Extract text from PDF
    console.log('Extracting text from PDF...');
    const pdfArrayBuffer = await pdfFile.arrayBuffer();
    
    try {
      // Load the PDF document
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(pdfArrayBuffer) });
      const pdf = await loadingTask.promise;
      
      let extractedText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        extractedText += pageText + ' ';
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
    } catch (pdfError) {
      console.error('Error extracting text from PDF:', pdfError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'extraction du texte du PDF' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in generate-glossary function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur est survenue lors de la génération du glossaire' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

