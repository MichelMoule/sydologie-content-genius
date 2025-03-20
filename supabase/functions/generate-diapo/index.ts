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
      primary: "#1A1F2C",    // Sydologie dark purple
      secondary: "#9b87f5",  // Sydologie primary purple
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
      Your task is to generate a complete presentation in Reveal.js HTML format based on the provided outline and content.
      For each section and subsection in the outline, create appropriate slides with engaging, educational content from the provided material.
      
      Guidelines:
      - Use proper Reveal.js HTML format with sections and slides
      - Include a title slide with a compelling title, subtitle, and brand colors (${themeColors.primary} for primary text, ${themeColors.secondary} for highlights)
      - For each section in the outline, create a section title slide with a visually distinct style (use class="section-title")
      - For each subsection, create content slides with relevant information from the provided content
      
      Visual Design Elements:
      1. Instead of traditional bullet points, create stylized feature panels:
         - Use div elements with class="feature-panel" for important points
         - Apply soft background colors (#e6f7f2, #f0f7ff, #fff8e6)
         - Add appropriate padding and rounded corners (style="padding: 15px; border-radius: 10px;")
         - Example: <div class="feature-panel" style="background-color: #e6f7f2; padding: 15px; border-radius: 10px;">Entrepreneurs et dirigeants</div>
      
      2. Create vertical timeline/process elements with numbers:
         - Use div with class="timeline-item" containing a numbered icon and content
         - Example: 
           <div class="timeline-item">
             <div class="timeline-number" style="background-color: ${themeColors.primary}; color: white;">1</div>
             <div class="timeline-content">
               <h3>Titre de l'étape</h3>
               <ul><li>Point détaillé</li></ul>
             </div>
           </div>
      
      3. Create grid layouts for comparing options:
         - Use div with class="grid-container" containing multiple "grid-item" divs
         - Example:
           <div class="grid-container">
             <div class="grid-item" style="background-color: #e6f7f2;">
               <h3>OPCO</h3>
               <p>L'OPCO de votre entreprise peut prendre en charge la formation si vous êtes salarié.</p>
             </div>
             <!-- Additional grid items -->
           </div>
      
      Visual elements to include:
      - Well-formatted bullet points using <ul> and <li> with proper indentation and styling
      - Numbered lists using <ol> and <li> where appropriate (for steps, processes)
      - Use <span class="highlight"> for important terms or keywords
      
      Data Visualization & Animation:
      - Include SVG charts and diagrams using the built-in plugins
      - Use the 'chart' plugin for data visualization where appropriate
      - Create simple SVG diagrams for concepts and processes
      
      Design techniques:
      - Use data-background-gradient="linear-gradient(to right, ${themeColors.primary}, #3a8573)" for section title slides
      - Create two-column layouts using div with class="columns" containing div with class="column"
      - Use blockquotes with left border styling for important statements
      - Add image placeholders with descriptive captions for visuals
      
      Advanced Reveal.js features:
      - Add data-auto-animate attributes to create smooth transitions between related slides
      - Use fragments (class="fragment") to reveal bullet points sequentially
      - Include presenter notes with <aside class="notes"> for speaker guidance
      
      Return ONLY the complete HTML for the Reveal.js presentation.
      The HTML should start with <div class="reveal"> and end with </div>
      Include SVG diagrams and charts where they would enhance understanding of complex concepts.
      Do not include any explanatory text outside of the HTML.`;
      
      userPrompt = `Content: ${content}\n\nOutline: ${JSON.stringify(outline)}\n\nColors: ${JSON.stringify(themeColors)}`;
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
            padding: 15px 20px;
            border-radius: 12px;
            margin: 15px 0;
            border-left: 5px solid var(--primary-color);
            font-size: 1.1em;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          
          /* Timeline/numbered items */
          .reveal .timeline-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 30px;
            position: relative;
          }
          
          .reveal .timeline-number {
            background-color: var(--primary-color);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2em;
            flex-shrink: 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            margin-right: 15px;
            margin-top: 5px;
            position: relative;
            z-index: 2;
          }
          
          .reveal .timeline-content {
            flex: 1;
            padding-bottom: 10px;
          }
          
          .reveal .timeline-item:not(:last-child):after {
            content: "";
            position: absolute;
            left: 20px;
            top: 45px;
            bottom: -15px;
            width: 2px;
            background-color: var(--primary-color);
            opacity: 0.3;
            z-index: 1;
          }
          
          /* Grid layout */
          .reveal .grid-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
          }
          
          .reveal .grid-item {
            background-color: var(--light-primary);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          
          .reveal .grid-item h3 {
            margin-top: 0;
            color: var(--primary-color);
            font-size: 1.3em;
            border-bottom: 2px solid var(--secondary-color);
            padding-bottom: 8px;
            margin-bottom: 15px;
          }
          
          /* Enhanced bullet points */
          .reveal ul { list-style-type: none; margin-left: 0; }
          .reveal ul li { 
            position: relative; 
            margin-bottom: 0.8em; 
            padding-left: 1.5em; 
          }
          .reveal ul li:before {
            content: "•"; 
            color: var(--secondary-color); 
            font-weight: bold; 
            font-size: 1.2em;
            position: absolute;
            left: 0;
          }
          
          /* Numbered lists */
          .reveal ol { 
            counter-reset: li;
            list-style: none;
            padding-left: 1em;
          }
          .reveal ol li {
            counter-increment: li;
            margin-bottom: 0.8em;
            position: relative;
            padding-left: 1.5em;
          }
          .reveal ol li:before {
            content: counter(li);
            color: var(--primary-color);
            font-weight: bold;
            background: rgba(var(--primary-color-rgb), 0.1);
            border-radius: 50%;
            width: 1.2em;
            height: 1.2em;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
          }
          
          /* Two-column layout */
          .reveal .columns {
            display: flex;
            justify-content: space-between;
            gap: 2em;
          }
          .reveal .column {
            flex: 1;
          }
          
          /* Block quotes */
          .reveal blockquote { 
            border-left: 4px solid var(--secondary-color); 
            padding: 1em 1.5em;
            font-style: italic;
            background: var(--light-secondary);
            border-radius: 0 8px 8px 0;
            margin: 1em 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
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
            margin: 1em 0;
          }
          
          /* Calculate RGB values from hex for rgba usage */
          :root {
            --primary-color-rgb: ${hexToRgb(themeColors.primary)};
            --secondary-color-rgb: ${hexToRgb(themeColors.secondary)};
          }
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
