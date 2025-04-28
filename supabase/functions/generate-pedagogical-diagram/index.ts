
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, type, format } = await req.json();

    if (type === 'suggestions') {
      // Generate diagram suggestions
      const prompt = `À partir du contenu pédagogique suivant, propose 3 descriptions de schémas pédagogiques pertinents :

Contenu pédagogique :
${content}

Chaque proposition doit être claire et concise, décrivant précisément le schéma. Numérote chaque proposition.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      console.log("OpenAI API response:", JSON.stringify(data));
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Réponse invalide de l\'API OpenAI: ' + JSON.stringify(data));
      }
      
      if (!data.choices[0].message) {
        throw new Error('Format de réponse OpenAI invalide: ' + JSON.stringify(data.choices[0]));
      }
      
      const suggestions = data.choices[0].message.content
        .split('\n')
        .filter(line => line.match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      return new Response(
        JSON.stringify({ suggestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'generate') {
      const formatString = format === '1:1' ? 'format carré, 1:1' :
                         format === '16:9' ? 'format horizontal, 16:9' :
                         'format vertical, 9:16';

      const prompt = `Schéma pédagogique clair, professionnel, ${formatString}, avec marges, aucun élément ne doit être coupé ou toucher les bords. Inclure des textes explicatifs clairs et lisibles directement sur le schéma pour chaque élément important. Représenter : ${content}`;

      console.log("Sending prompt to OpenAI:", prompt);

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          response_format: 'b64_json'
        }),
      });

      const data = await response.json();
      console.log("Image API response structure:", Object.keys(data));
      
      if (!data.data) {
        throw new Error('Réponse invalide de l\'API OpenAI (data manquant): ' + JSON.stringify(data));
      }
      
      if (!data.data.length) {
        throw new Error('Réponse invalide de l\'API OpenAI (tableau data vide): ' + JSON.stringify(data));
      }
      
      const imageData = data.data[0];
      if (!imageData || !imageData.b64_json) {
        throw new Error('Réponse invalide de l\'API OpenAI (b64_json manquant): ' + JSON.stringify(data.data));
      }
      
      return new Response(
        JSON.stringify({ image: imageData.b64_json }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Type non valide spécifié');
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
