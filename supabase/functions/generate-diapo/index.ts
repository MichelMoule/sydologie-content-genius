import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const AZURE_ENDPOINT = "https://sydo-chatgpt.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-15-preview";
const AZURE_API_KEY = Deno.env.get('AZURE_OPENAI_API_KEY');

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // If we get a rate limit error (429), retry with exponential backoff
    if (response.status === 429 && retries > 0) {
      console.log(`Rate limit hit (429). Retrying in ${delay / 1000} seconds... Attempts remaining: ${retries}`);
      
      // Get retry-after header if available, otherwise use our exponential backoff
      const retryAfter = response.headers.get('retry-after');
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;
      
      // Wait for the specified time
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Retry with exponential backoff
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Fetch failed. Retrying in ${delay / 1000} seconds... Attempts remaining: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, step, outline = null, colors = null } = await req.json();

    if (!content && step === 'outline') {
      throw new Error('Content is required for generating an outline');
    }

    if (!outline && step === 'slides') {
      throw new Error('Outline is required for generating slides');
    }

    let systemPrompt = '';
    let userPrompt = '';

    // Default Sydologie colors that can be overridden
    const themeColors = colors || {
      primary: "#1B4D3E",    // Sydologie green
      secondary: "#FF9B7A",  // Sydologie coral
      background: "#FFFFFF", // White background
      text: "#333333"        // Dark gray for text
    };

    if (step === 'outline') {
      systemPrompt = `You are an expert presentation designer specialized in creating educational content. 
      Your task is to analyze the provided training content and suggest a clear, logical presentation outline.
      Create a comprehensive outline with main sections and subsections.
      Return ONLY a JSON array of objects with 'section' (main section title) and 'subsections' (array of subsection titles) properties.
      Example: [{"section":"Introduction","subsections":["Context","Objectives","Agenda"]},{"section":"Main Content","subsections":["Topic 1","Topic 2"]}]
      DO NOT include any markdown formatting or explanation text in your response.`;
      
      userPrompt = content;
    } else if (step === 'slides') {
      systemPrompt = `You are an expert presentation designer specialized in creating visually stunning and educational presentations with advanced data visualization and animation capabilities.
      
      Your task is to generate a complete Reveal.js presentation based on the outline and content provided.
      IMPORTANT: For optimal rendering, I want you to create a well-structured HTML output with properly organized slides.
      
      Follow this exact structure:
      1. Create a title slide with class="title-slide" containing the main title and subtitle
      2. For EACH section in the outline, create a section title slide with class="section-title" containing just the section title
      3. For EACH subsection, create a separate slide with class="slide-content" containing:
         - A heading with the subsection name
         - Relevant content extracted from the provided material
      
      For the content of each slide:
      - Use bullet points for lists of concepts or features
      - Use numbered lists for sequential processes or steps
      - Include visually distinctive elements by using the feature-panel, timeline-item, or grid-container classes
      - Create SVG diagrams when appropriate for visualizing relationships or processes
      
      Structure your HTML output like this:
      
      <div class="reveal">
        <div class="slides">
          <!-- Title slide -->
          <section>
            <div class="title-slide">
              <h1>Main Title</h1>
              <h3>Subtitle</h3>
            </div>
          </section>
          
          <!-- For each section in the outline -->
          <section>
            <div class="section-title">
              <h2>Section Title</h2>
            </div>
          </section>
          
          <!-- For each subsection in that section -->
          <section>
            <div class="slide-content">
              <h3>Subsection Title</h3>
              <!-- Content for this subsection -->
              <ul>
                <li>Point 1</li>
                <li>Point 2</li>
              </ul>
            </div>
          </section>
          
          <!-- Repeat for all sections and subsections -->
        </div>
      </div>
      
      Remember to:
      - Keep slide content focused and concise
      - Use visual elements appropriately based on content type
      - Include SVG diagrams when they help understand complex concepts
      - Ensure proper nesting of HTML elements
      
      Return ONLY the complete HTML for the Reveal.js presentation, without any additional explanations.`;
      
      userPrompt = `Content: ${content}\n\nOutline: ${JSON.stringify(outline)}\n\nColors: ${JSON.stringify(themeColors)}`;
    }

    console.log(`Making request to Azure OpenAI for step: ${step}`);
    console.log(`System prompt: ${systemPrompt.substring(0, 100)}...`);
    console.log(`User prompt (truncated): ${userPrompt.substring(0, 100)}...`);

    const body = JSON.stringify({
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
    });

    // Use the fetchWithRetry function instead of regular fetch
    const response = await fetchWithRetry(
      AZURE_ENDPOINT, 
      {
        method: 'POST',
        headers: {
          'api-key': AZURE_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: body
      }
    );

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
      
      // Add enhanced CSS for styling with dynamic colors
      const styledResult = result.replace('<div class="reveal">', `<div class="reveal">
        <style>
          :root {
            --primary-color: ${themeColors.primary};
            --secondary-color: ${themeColors.secondary};
            --background-color: ${themeColors.background};
            --text-color: ${themeColors.text};
            --light-primary: ${lightenColor(themeColors.primary, 0.9)};
            --light-secondary: ${lightenColor(themeColors.secondary, 0.9)};
          }
          
          .reveal h1, .reveal h2 { color: var(--primary-color); font-weight: 700; margin-bottom: 0.5em; }
          .reveal h3, .reveal h4 { color: var(--primary-color); font-weight: 600; }
          .reveal .highlight { color: var(--secondary-color); font-weight: 600; }
          .reveal .text-primary { color: var(--primary-color); }
          .reveal .text-secondary { color: var(--secondary-color); }
          
          /* Feature panels - styled boxes with content */
          .reveal .feature-panel {
            background-color: var(--light-primary);
            color: var(--text-color);
            padding: 12px 16px;
            border-radius: 10px;
            margin: 12px 0;
            border-left: 4px solid var(--primary-color);
            font-size: 0.95em;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          
          /* Timeline/numbered items */
          .reveal .timeline-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 24px;
            position: relative;
          }
          
          .reveal .timeline-number {
            background-color: var(--primary-color);
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.1em;
            flex-shrink: 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            margin-right: 12px;
            margin-top: 4px;
            position: relative;
            z-index: 2;
          }
          
          .reveal .timeline-content {
            flex: 1;
            padding-bottom: 8px;
          }
          
          .reveal .timeline-item:not(:last-child):after {
            content: "";
            position: absolute;
            left: 18px;
            top: 36px;
            bottom: -12px;
            width: 2px;
            background-color: var(--primary-color);
            opacity: 0.3;
            z-index: 1;
          }
          
          /* Grid layout */
          .reveal .grid-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin: 16px 0;
          }
          
          .reveal .grid-item {
            background-color: var(--light-primary);
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          
          .reveal .grid-item h3 {
            margin-top: 0;
            color: var(--primary-color);
            font-size: 1.15em;
            border-bottom: 2px solid var(--secondary-color);
            padding-bottom: 6px;
            margin-bottom: 12px;
          }
          
          /* Enhanced bullet points */
          .reveal ul { list-style-type: none; margin-left: 0; }
          .reveal ul li { 
            position: relative; 
            margin-bottom: 0.7em; 
            padding-left: 1.3em; 
            font-size: 0.95em;
          }
          .reveal ul li:before {
            content: "•"; 
            color: var(--secondary-color); 
            font-weight: bold; 
            font-size: 1.1em;
            position: absolute;
            left: 0;
          }
          
          /* Numbered lists */
          .reveal ol { 
            counter-reset: li;
            list-style: none;
            padding-left: 0.8em;
          }
          .reveal ol li {
            counter-increment: li;
            margin-bottom: 0.7em;
            position: relative;
            padding-left: 1.3em;
            font-size: 0.95em;
          }
          .reveal ol li:before {
            content: counter(li);
            color: var(--primary-color);
            font-weight: bold;
            background: rgba(var(--primary-color-rgb), 0.1);
            border-radius: 50%;
            width: 1.1em;
            height: 1.1em;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
          }
          
          /* Tables */
          .reveal table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
            font-size: 0.9em;
          }
          .reveal table th {
            background-color: rgba(var(--primary-color-rgb), 0.15);
            color: var(--primary-color);
            font-weight: bold;
            text-align: left;
            padding: 8px;
            border: 1px solid rgba(var(--primary-color-rgb), 0.25);
          }
          .reveal table td {
            padding: 8px;
            border: 1px solid rgba(var(--primary-color-rgb), 0.15);
          }
          .reveal table tr:nth-child(even) {
            background-color: rgba(var(--primary-color-rgb), 0.05);
          }
          
          /* Two-column layout */
          .reveal .columns {
            display: flex;
            justify-content: space-between;
            gap: 1.5em;
          }
          .reveal .column {
            flex: 1;
          }
          
          /* Block quotes */
          .reveal blockquote { 
            border-left: 3px solid var(--secondary-color); 
            padding: 0.8em 1.2em;
            font-style: italic;
            background: var(--light-secondary);
            border-radius: 0 6px 6px 0;
            margin: 0.8em 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            font-size: 0.95em;
          }
          
          /* Section title slides */
          .reveal section.section-title {
            background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1) 0%, rgba(255,255,255,0.9) 100%);
          }
          
          /* Title slide */
          .reveal section.title-slide {
            background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
          }
          
          /* Horizontal divider */
          .reveal hr {
            border: 0;
            height: 2px;
            background: linear-gradient(to right, transparent, var(--primary-color), transparent);
            margin: 0.8em 0;
          }
          
          /* SVG diagrams */
          .reveal .svg-diagram {
            width: 90%;
            max-width: 700px;
            margin: 0 auto;
            display: block;
          }
          
          .reveal .diagram-caption {
            text-align: center;
            font-style: italic;
            margin-top: 0.4em;
            color: var(--text-color);
            opacity: 0.8;
            font-size: 0.9em;
          }
          
          /* Calculate RGB values from hex for rgba usage */
          :root {
            --primary-color-rgb: ${hexToRgb(themeColors.primary)};
            --secondary-color-rgb: ${hexToRgb(themeColors.secondary)};
          }
          
          /* Global font size adjustments */
          .reveal { font-size: 95%; }
          .reveal h1 { font-size: 1.8em; }
          .reveal h2 { font-size: 1.5em; }
          .reveal h3 { font-size: 1.3em; }
          .reveal p { font-size: 0.95em; }
        </style>`);
      
      return new Response(JSON.stringify({ slidesHtml: styledResult }), {
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

// Helper function to convert hex color to RGB format for rgba()
function hexToRgb(hex: string) {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  return `${r}, ${g}, ${b}`;
}

// Function to lighten a color for backgrounds
function lightenColor(hex: string, factor: number): string {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  // Lighten the color
  r = Math.round(r + (255 - r) * factor);
  g = Math.round(g + (255 - g) * factor);
  b = Math.round(b + (255 - b) * factor);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
