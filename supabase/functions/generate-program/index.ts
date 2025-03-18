
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import mammoth from 'npm:mammoth@1.6.0';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { programName, subjectMatter, targetAudience, duration, learningObjectives, prerequisites, preferredFormat, additionalRequirements, fileContent } = await req.json();

    console.log('Generating program for:', programName);
    console.log('File content received:', fileContent ? 'Yes' : 'No');
    
    const apiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Build the prompt
    let prompt = `
      Génère un programme pédagogique complet et détaillé sur le sujet suivant: "${subjectMatter}".
      
      Nom du programme: ${programName}
      Public cible: ${targetAudience}
      Durée totale: ${duration}
      Objectifs d'apprentissage: ${learningObjectives}
      Prérequis: ${prerequisites || "Aucun prérequis spécifique"}
      Format préféré: ${preferredFormat}
      Exigences supplémentaires: ${additionalRequirements || "N/A"}
    `;

    // Add file content to prompt if available
    if (fileContent) {
      prompt += `
      
      Voici le contenu du document fourni que tu dois utiliser pour enrichir le programme:
      ${fileContent.substring(0, 10000)} // We limit to first 10K chars to avoid token limits
      
      `;
    }

    prompt += `
      Le programme doit inclure:
      1. Un aperçu général du programme
      2. Des objectifs globaux d'apprentissage (liste)
      3. Une description détaillée du public cible
      4. Les prérequis nécessaires
      5. Les méthodes d'évaluation recommandées (liste)
      6. Une série de modules cohérents (au moins 3-5)
      
      Pour chaque module, inclus:
      - Un titre clair
      - Une durée spécifique
      - Des objectifs d'apprentissage (2-4 par module)
      - Une description détaillée du contenu
      - Des activités pédagogiques recommandées (2-3 par module)
      - Des ressources pédagogiques suggérées (2-3 par module)
      
      Formate ta réponse au format JSON selon la structure suivante:
      {
        "overview": "aperçu général du programme",
        "globalObjectives": ["objectif 1", "objectif 2", ...],
        "targetAudience": "description détaillée du public cible",
        "prerequisites": "prérequis nécessaires",
        "evaluationMethods": ["méthode 1", "méthode 2", ...],
        "modules": [
          {
            "title": "titre du module",
            "duration": "durée du module",
            "objectives": ["objectif 1", "objectif 2", ...],
            "content": "contenu détaillé du module",
            "activities": ["activité 1", "activité 2", ...],
            "resources": ["ressource 1", "ressource 2", ...]
          },
          ...
        ]
      }
    `;

    // Call Azure OpenAI API with the updated endpoint
    const response = await fetch('https://sydo-chatgpt.openai.azure.com/openai/deployments/gpt-4o-mini-2/chat/completions?api-version=2024-08-01-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Tu es un expert en ingénierie pédagogique et en formation professionnelle. Tu es capable de créer des programmes pédagogiques complets et cohérents adaptés aux besoins spécifiques.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    const result = await response.json();
    console.log('Received response from Azure OpenAI');

    if (!result.choices || result.choices.length === 0) {
      console.error('Invalid response from Azure OpenAI:', result);
      throw new Error('Invalid response from the AI service');
    }

    const aiContent = result.choices[0].message.content;
    let programData;

    try {
      // Extract JSON from response
      const jsonMatch = aiContent.match(/```json\n([\s\S]*)\n```/) || 
                         aiContent.match(/```\n([\s\S]*)\n```/) ||
                         aiContent.match(/{[\s\S]*}/);
      
      const jsonString = jsonMatch ? jsonMatch[0] : aiContent;
      const cleanedJson = jsonString.replace(/```json\n|```\n|```/g, '');
      
      programData = JSON.parse(cleanedJson);
      console.log('Successfully parsed program data');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.log('Raw response:', aiContent);
      throw new Error('Failed to parse program data from AI response');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        program: programData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-program function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
