
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
    const { content, type, description, format, drawingDataUrl } = await req.json();

    // Si on reçoit un dessin, on l'inclut dans le prompt
    const promptPrefix = drawingDataUrl 
      ? "En utilisant ce schéma comme référence et en l'améliorant professionnellement: "
      : "";

    if (type === 'suggestions') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en schématisation pédagogique qui aide à transformer du contenu en schémas clairs et efficaces.'
            },
            {
              role: 'user',
              content: `Propose 3 façons différentes de représenter ce contenu sous forme de schéma pédagogique:\n\n${content}`
            }
          ],
        }),
      });

      const data = await response.json();
      const suggestions = data.choices[0].message.content
        .split('\n')
        .filter(line => line.length > 0 && !line.startsWith('1') && !line.startsWith('2') && !line.startsWith('3'))
        .map(line => line.replace(/^[^a-zA-Z]+/, '').trim());

      return new Response(
        JSON.stringify({ suggestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const promptText = description || content;
    const fullPrompt = `${promptPrefix}${promptText}`;

    // Paramètres pour GPT Image
    const params = {
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: format === "1:1" ? "1024x1024" : 
            format === "16:9" ? "1536x1024" : 
            "1024x1536",
      quality: "high",
    };

    // Si on a un dessin, on l'ajoute comme référence
    if (drawingDataUrl) {
      // Extraire la partie base64 de l'URL data
      const base64Image = drawingDataUrl.split(',')[1];
      params.image = base64Image;
    }

    const imageResponse = await fetch('https://api.openai.com/v1/images/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const imageData = await imageResponse.json();
    
    if (!imageData.data?.[0]?.b64_json) {
      throw new Error('Réponse invalide de l\'API OpenAI');
    }

    return new Response(
      JSON.stringify({ image: imageData.data[0].b64_json }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

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
