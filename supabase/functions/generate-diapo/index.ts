
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const AZURE_ENDPOINT = "https://sydo-chatgpt.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-15-preview";
const AZURE_API_KEY = Deno.env.get('AZURE_OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, step, outline = null } = await req.json();

    if (!content && step === 'outline') {
      throw new Error('Content is required for generating an outline');
    }

    if (!outline && step === 'slides') {
      throw new Error('Outline is required for generating slides');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (step === 'outline') {
      systemPrompt = `You are an expert presentation designer specialized in creating educational content. 
      Your task is to analyze the provided training content and suggest a clear, logical presentation outline.
      Create a comprehensive outline with main sections and subsections.
      Return ONLY a JSON array of objects with 'section' (main section title) and 'subsections' (array of subsection titles) properties.
      Example: [{"section":"Introduction","subsections":["Context","Objectives","Agenda"]},{"section":"Main Content","subsections":["Topic 1","Topic 2"]}]
      DO NOT include any markdown formatting or explanation text in your response.`;
      
      userPrompt = content;
    } else if (step === 'slides') {
      systemPrompt = `You are an expert presentation designer specialized in creating educational content.
      Your task is to generate a complete presentation in Reveal.js HTML format based on the provided outline and content.
      For each section and subsection in the outline, create appropriate slides with engaging, educational content from the provided material.
      
      Guidelines:
      - Use proper Reveal.js HTML format with sections and slides
      - Include a title slide with a compelling title based on the content
      - For each section in the outline, create a section title slide
      - For each subsection, create content slides with relevant information from the provided content
      - Use appropriate formatting for headers, bullet points, and emphasis
      - Keep text concise on each slide (maximum 40 words per slide)
      - Include presenter notes with more detailed information and speaking points
      - Add transition suggestions where appropriate
      
      Return ONLY the complete HTML for the Reveal.js presentation.
      The HTML should start with <div class="reveal"> and end with </div>
      Do not include any explanatory text outside of the HTML.`;
      
      userPrompt = `Content: ${content}\n\nOutline: ${JSON.stringify(outline)}`;
    }

    console.log(`Making request to Azure OpenAI for step: ${step}`);
    console.log(`System prompt: ${systemPrompt.substring(0, 100)}...`);
    console.log(`User prompt (truncated): ${userPrompt.substring(0, 100)}...`);

    const response = await fetch(AZURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': AZURE_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
        max_tokens: step === 'slides' ? 4096 : 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Azure OpenAI API error (${response.status}): ${errorText}`);
      throw new Error(`Azure OpenAI API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Azure OpenAI Response status:', response.status);

    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response format:', JSON.stringify(data));
      throw new Error('Invalid response format from Azure OpenAI API');
    }

    let result = data.choices[0].message.content.trim();
    console.log(`Result (truncated): ${result.substring(0, 100)}...`);
    
    if (step === 'outline') {
      try {
        // If the response is wrapped in code blocks, remove them
        result = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const outlineData = JSON.parse(result);
        return new Response(JSON.stringify({ outline: outlineData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error parsing outline JSON:', error);
        console.error('Raw text that failed to parse:', result);
        throw new Error('Invalid response format from AI');
      }
    } else {
      // For slides, just return the HTML content
      result = result.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
      return new Response(JSON.stringify({ slidesHtml: result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-diapo function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
