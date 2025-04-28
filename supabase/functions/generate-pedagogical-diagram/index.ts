
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
      const suggestions = data.choices[0].message.content
        .split('\n')
        .filter(line => line.match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      return new Response(
        JSON.stringify({ suggestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'generate') {
      // Generate diagram image
      const formatString = format === '1:1' ? 'format carré, 1:1' :
                         format === '16:9' ? 'format horizontal, 16:9' :
                         'format vertical, 9:16';

      const prompt = `Schéma pédagogique clair, professionnel, ${formatString}, avec marges, aucun élément ne doit être coupé ou toucher les bords. Représenter : ${content}`;

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'b64_json'
        }),
      });

      const data = await response.json();
      
      return new Response(
        JSON.stringify({ image: data.data[0].b64_json }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid type specified');
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
