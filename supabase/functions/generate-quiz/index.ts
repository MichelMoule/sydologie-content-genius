
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const AZURE_ENDPOINT = "https://sydo-chatgpt.openai.azure.com/openai/deployments/gpt-4o-mini-2/chat/completions?api-version=2024-08-01-preview";
const AZURE_API_KEY = Deno.env.get('AZURE_OPENAI_API_KEY');

console.log("Hello from generate-quiz Function!");

serve(async (req) => {
  console.log('Request method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Received request body:', requestBody);
    
    const { courseContent, courseFile, quizType, learningObjectives, numberOfQuestions, difficultyLevel } = requestBody;

    let finalContent = courseContent;

    // Handle file content if present
    if (courseFile) {
      const fileData = courseFile.data;
      const fileName = courseFile.name.toLowerCase();

      if (fileName.endsWith('.txt')) {
        const decoder = new TextDecoder('utf-8');
        finalContent += '\n' + decoder.decode(fileData);
      } else {
        throw new Error('Format de fichier non supporté. Veuillez utiliser un fichier texte (.txt)');
      }
    }

    const systemPrompt = `Vous êtes un expert en pédagogie qui excelle dans la création de quiz d'évaluation.
    
Instructions spécifiques :
1. Créez un quiz de ${numberOfQuestions} questions basé sur le contenu fourni
2. Adaptez les questions au niveau ${difficultyLevel} et au type ${quizType}
3. Assurez-vous que les questions testent les objectifs pédagogiques suivants : ${learningObjectives}
4. Pour chaque question, fournissez un feedback explicatif qui aide à comprendre pourquoi la réponse est correcte

Format de sortie STRICT en JSON dans le Markdown :

\`\`\`json
{
  "questions": [
    {
      "question": "Texte de la question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "feedback": "Explication détaillée de la réponse correcte"
    }
  ]
}
\`\`\`

Assurez-vous que :
1. Le JSON soit valide et parsable
2. correctAnswer soit un nombre (index de la bonne réponse)
3. Chaque question ait exactement 4 options
4. Chaque question ait un feedback explicatif
5. Le JSON soit encadré par les triples backticks et le mot 'json'`;

    const userPrompt = `Voici le contenu du cours pour lequel je souhaite générer un quiz :

${finalContent}

Merci de suivre strictement le format JSON demandé dans le prompt système pour la génération du quiz.`;

    console.log('Preparing request to Azure OpenAI');
    const requestBodyForAzure = {
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 2000
    };

    const response = await fetch(AZURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
      },
      body: JSON.stringify(requestBodyForAzure),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Azure API responded with status ${response.status}: ${responseText}`);
    }

    const responseData = await response.json();
    console.log('Azure API Response:', responseData);

    // Extract the JSON from the markdown response
    const content = responseData.choices[0].message.content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    
    if (!jsonMatch) {
      throw new Error("Format de réponse invalide");
    }
    
    const quiz = JSON.parse(jsonMatch[1]);

    return new Response(
      JSON.stringify({ quiz }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error generating quiz:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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

