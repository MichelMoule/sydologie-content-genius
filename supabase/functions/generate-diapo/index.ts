
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
      Your task is to generate a complete presentation in Reveal.js HTML format based on the provided outline and content.
      For each section and subsection in the outline, create appropriate slides with engaging, educational content from the provided material.
      
      CRITICALLY IMPORTANT: You MUST INTELLIGENTLY VARY the presentation formats based on the SPECIFIC CONTENT TYPE. You should analyze the content of each slide and choose the MOST APPROPRIATE format. DO NOT use the same format for all slides or alternate formats mechanically.
      
      For example:
      - Use bullet points for concepts, features, advantages, or simple lists
      - Use timeline items for sequential processes, historical events, chronological steps, or evolution of concepts
      - Use feature panels for highlighting critical information, key takeaways, warnings, or important definitions
      - Use grid layouts for comparing options, presenting related concepts side by side, or showing classifications
      - Use tables for structured data, comparisons with multiple attributes, or matrices
      - Use diagrams for relationships, processes, workflows, or hierarchies
      
      SELECTION CRITERIA FOR FORMATS:
      1. BULLET POINTS: Use for general lists, simple concepts, features, or characteristics
         - Best for: Features, advantages, quick facts, short items without hierarchy
         - Example content: "Benefits of our approach", "Key characteristics", "Components"
      
      2. TIMELINE ITEMS: Use for sequential or chronological content
         - Best for: Steps, historical evolution, procedures, sequential processes
         - Example content: "Historical development", "Step-by-step process", "Implementation phases"
      
      3. FEATURE PANELS: Use for highlighting important points, warnings or takeaways
         - Best for: Key definitions, important warnings, standout information, memorable quotes
         - Example content: "Definition of key terms", "Critical warnings", "Remember this"
      
      4. GRID LAYOUTS: Use for comparing items or presenting related concepts
         - Best for: Comparing options, showing classifications, presenting paired concepts
         - Example content: "Approach comparison", "Types of methodologies", "Category overview"
      
      5. TABLES: Use for structured data with multiple attributes
         - Best for: Detailed comparisons, data with multiple columns, matrices
         - Example content: "Feature comparison chart", "Results table", "Multi-attribute analysis"
      
      6. DIAGRAMS: Use for showing relationships or processes
         - Best for: Workflows, organizational structures, concept relationships, hierarchies
         - Example content: "Process flow", "Organizational structure", "Concept map"
      
      Keep these presentation guidelines in mind:
      - Use proper Reveal.js HTML format with sections and slides
      - Include a title slide with a compelling title, subtitle, and brand colors (${themeColors.primary} for primary text, ${themeColors.secondary} for highlights)
      - For each section in the outline, create a section title slide with a visually distinct style (use class="section-title")
      - For each subsection, create content slides with relevant information from the provided content
      - Font sizes should be reduced from default (h1: 32px, h2: 28px, h3: 24px, body: 14px)
      
      Visual Design Elements (VARY THESE BY CONTENT TYPE):
      1. Feature panels for important points:
         <div class="feature-panel">Important concept or definition</div>
      
      2. Timeline items for sequential processes:
         <div class="timeline-item">
           <div class="timeline-number">1</div>
           <div class="timeline-content">
             <h3>Step Title</h3>
             <p>Step description</p>
           </div>
         </div>
      
      3. Grid layouts for comparing options:
         <div class="grid-container">
           <div class="grid-item">
             <h3>Option 1</h3>
             <p>Description 1</p>
           </div>
           <div class="grid-item">
             <h3>Option 2</h3>
             <p>Description 2</p>
           </div>
         </div>
      
      4. Standard formatting elements:
         - Bullet points using <ul> and <li> for simple lists
         - Numbered lists using <ol> and <li> for ordered procedures
         - Use <span class="highlight"> for important terms
         - Tables using <table>, <tr>, <th>, <td> for structured data
      
      REMEMBER: INTELLIGENTLY ANALYZE the content of each slide to choose the most appropriate presentation format. Each slide's content should dictate its format, not any mechanical alternation of styles.
      
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
