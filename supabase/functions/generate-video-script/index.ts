
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const AZURE_ENDPOINT = "https://sydo-chatgpt.openai.azure.com/openai/deployments/gpt-4o-mini-2/chat/completions?api-version=2024-08-01-preview";
const AZURE_API_KEY = Deno.env.get('AZURE_OPENAI_API_KEY');

console.log("Starting generate-video-script Function!");

serve(async (req) => {
  console.log('Request method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('Received request:', requestData);
    
    const { 
      topic, 
      targetAudience, 
      duration, 
      learningObjectives, 
      tone, 
      visualStyle, 
      additionalInstructions 
    } = requestData;

    if (!topic) {
      throw new Error('Le sujet de la vidéo est requis');
    }

    if (!AZURE_API_KEY) {
      throw new Error('Azure OpenAI API key is not configured');
    }

    const systemPrompt = `Tu es un expert en scénarisation de vidéos pédagogiques. Tu sais comment créer des scripts éducatifs efficaces qui engagent et instruisent le public cible.
    
Instructions spécifiques :
1. Crée un script de vidéo pédagogique sur le sujet "${topic}"
2. Le script doit être adapté pour une vidéo d'une durée de ${duration || "5-7 minutes"}
3. Adapte le contenu pour un public de type: ${targetAudience || "adultes en formation professionnelle"}
4. Le ton doit être ${tone || "professionnel mais accessible"}
5. Inclus des suggestions de visuels qui suivent un style ${visualStyle || "simple et épuré"}

Format de sortie STRICT en JSON dans le Markdown :

\`\`\`json
{
  "title": "Titre accrocheur pour la vidéo",
  "targetAudience": "Public cible",
  "duration": "Durée estimée",
  "learningObjectives": ["Objectif 1", "Objectif 2", "..."],
  "overview": "Résumé du contenu de la vidéo",
  "script": [
    {
      "section": "Introduction",
      "narration": "Texte du narrateur pour cette section",
      "visualNotes": "Description des éléments visuels",
      "duration": "Durée estimée de cette section"
    },
    {
      "section": "Partie 1: [Titre]",
      "narration": "Texte du narrateur pour cette section",
      "visualNotes": "Description des éléments visuels",
      "duration": "Durée estimée de cette section"
    },
    {
      "section": "Conclusion",
      "narration": "Texte du narrateur pour cette section",
      "visualNotes": "Description des éléments visuels",
      "duration": "Durée estimée de cette section"
    }
  ],
  "additionalNotes": "Notes supplémentaires sur le script"
}
\`\`\`

Assure-toi que :
1. Le JSON soit valide et parsable
2. Les objectifs d'apprentissage soient clairs et mesurables
3. Le script soit divisé en sections logiques
4. Chaque section inclut à la fois le texte de narration et des suggestions visuelles
5. Le JSON soit encadré par les triples backticks et le mot 'json'`;

    console.log('Preparing request to Azure OpenAI');
    const requestBody = {
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Je souhaite créer une vidéo pédagogique sur ${topic}. 
          ${learningObjectives ? `Les objectifs d'apprentissage sont: ${learningObjectives}` : ''}
          ${additionalInstructions ? `Instructions supplémentaires: ${additionalInstructions}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    };

    const response = await fetch(AZURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Azure API responded with status ${response.status}: ${responseText}`);
    }

    const responseData = await response.json();
    console.log('Azure API Response received');

    // Extract the JSON from the markdown response
    const content = responseData.choices[0].message.content;
    console.log('Raw content:', content);
    
    let scriptData;
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) ||
                        content.match(/{[\s\S]*}/);
      
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      const cleanedJson = jsonString.replace(/```json\n|```\n|```/g, '');
      
      scriptData = JSON.parse(cleanedJson);
      console.log('Successfully parsed script data');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.log('Raw response:', content);
      throw new Error('Failed to parse script data from AI response');
    }

    return new Response(
      JSON.stringify({ success: true, script: scriptData }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error generating video script:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
