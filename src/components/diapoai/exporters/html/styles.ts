import { ThemeColors } from "../../types/ThemeColors";
import { hexToRgb, lightenColor } from "../../utils/ColorUtils";

/**
 * Generate CSS styles for the HTML export based on the selected theme colors
 */
export const generateStyles = (colors: ThemeColors): string => {
  return `
    :root {
      --primary-color: ${colors.primary};
      --secondary-color: ${colors.secondary};
      --background-color: ${colors.background};
      --text-color: ${colors.text};
      --primary-color-rgb: ${hexToRgb(colors.primary)};
      --secondary-color-rgb: ${hexToRgb(colors.secondary)};
      --light-primary: ${lightenColor(colors.primary, 0.9)};
      --light-secondary: ${lightenColor(colors.secondary, 0.9)};
    }
    
    body, .reveal { 
      font-family: 'DM Sans', sans-serif;
      background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%);
      min-height: 100vh;
      color: var(--text-color);
    }
    
    .reveal .slides { height: 100%; }
    
    .reveal h1 { 
      font-family: 'DM Sans', sans-serif;
      color: var(--primary-color); 
      font-weight: 700; 
      margin-bottom: 0.5em;
      font-size: 2.5em;
      line-height: 1.2;
    }
    
    .reveal h2 { 
      font-family: 'DM Sans', sans-serif;
      color: var(--primary-color); 
      font-weight: 700; 
      margin-bottom: 0.5em;
      font-size: 2em;
      line-height: 1.2;
    }
    
    .reveal h3 { 
      font-family: 'DM Sans', sans-serif;
      color: var(--primary-color); 
      font-weight: 600;
      font-size: 1.75em;
      line-height: 1.3;
      margin-bottom: 0.4em;
    }
    
    .reveal h4 { 
      font-family: 'DM Sans', sans-serif;
      color: var(--primary-color); 
      font-weight: 600;
      font-size: 1.5em;
      line-height: 1.3;
    }
    
    .reveal p, .reveal li {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.2em;
      line-height: 1.5;
    }
    
    .reveal blockquote {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.15em;
      line-height: 1.5;
    }
    
    .reveal .highlight { color: var(--secondary-color); font-weight: 600; }
    .reveal .text-primary { color: var(--primary-color); }
    .reveal .text-secondary { color: var(--secondary-color); }
    
    /* Feature panels - styled boxes with content */
    .reveal .feature-panel {
      font-family: 'DM Sans', sans-serif;
      background-color: var(--light-primary);
      color: var(--text-color);
      padding: 20px 25px;
      border-radius: 12px;
      margin: 20px 0;
      border-left: 5px solid var(--primary-color);
      font-size: 1.1em;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
    
    /* Timeline/numbered items */
    .reveal .timeline-item {
      font-family: 'DM Sans', sans-serif;
      display: flex;
      align-items: flex-start;
      margin-bottom: 30px;
      position: relative;
    }
    
    .reveal .timeline-number {
      background-color: var(--primary-color);
      color: white;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.3em;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      margin-right: 18px;
      margin-top: 5px;
      position: relative;
      z-index: 2;
    }
    
    .reveal .timeline-content {
      flex: 1;
      padding-bottom: 15px;
    }
    
    /* Grid layout */
    .reveal .grid-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      margin: 25px 0;
    }
    
    .reveal .grid-item {
      background-color: var(--light-primary);
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    
    .reveal .grid-item h3 {
      margin-top: 0;
      color: var(--primary-color);
      font-size: 1.4em;
      border-bottom: 2px solid var(--secondary-color);
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    
    /* Enhanced bullet points */
    .reveal ul { list-style-type: none; margin-left: 0; }
    .reveal ul li { 
      position: relative; 
      margin-bottom: 1em; 
      padding-left: 1.8em; 
    }
    .reveal ul li:before {
      content: "•"; 
      color: var(--secondary-color); 
      font-weight: bold; 
      font-size: 1.4em;
      position: absolute;
      left: 0;
      top: -0.1em;
    }
    
    /* Numbered lists */
    .reveal ol { 
      counter-reset: li;
      list-style: none;
      padding-left: 1.2em;
    }
    .reveal ol li {
      counter-increment: li;
      margin-bottom: 1em;
      position: relative;
      padding-left: 1.8em;
    }
    .reveal ol li:before {
      content: counter(li);
      color: var(--primary-color);
      font-weight: bold;
      background: rgba(var(--primary-color-rgb), 0.1);
      border-radius: 50%;
      width: 1.4em;
      height: 1.4em;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0;
    }
    
    /* Block quotes */
    .reveal blockquote { 
      border-left: 5px solid var(--secondary-color); 
      padding: 1.2em 1.8em;
      font-style: italic;
      background: var(--light-secondary);
      border-radius: 0 12px 12px 0;
      margin: 1.5em 0;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    
    /* Two-column layout */
    .reveal .columns {
      display: flex;
      justify-content: space-between;
      gap: 2.5em;
    }
    .reveal .column {
      flex: 1;
    }
    
    /* SVG diagrams */
    .reveal .svg-diagram {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      display: block;
    }
    
    .reveal .diagram-caption {
      text-align: center;
      font-style: italic;
      margin-top: 0.8em;
      color: var(--text-color);
      opacity: 0.8;
    }
    
    /* Image placeholders */
    .reveal .image-placeholder {
      background-color: #f0f0f0;
      border: 2px dashed #ccc;
      border-radius: 12px;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 25px auto;
      width: 85%;
      position: relative;
    }
    .reveal .image-placeholder:after {
      content: "Image illustrative";
      color: #888;
      font-style: italic;
      font-size: 1.1em;
    }
    
    /* Diagram styling */
    .reveal .diagram {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 1.5em auto;
      width: 90%;
    }
    .reveal .process-flow {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .reveal .process-step {
      background: rgba(var(--primary-color-rgb), 0.1);
      border: 2px solid var(--primary-color);
      border-radius: 10px;
      padding: 0.7em 1.2em;
      text-align: center;
      min-width: 110px;
      position: relative;
    }
    .reveal .process-step:not(:last-child):after {
      content: "→";
      position: absolute;
      right: -1.8em;
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary-color);
      font-size: 1.8em;
    }
    
    /* Tables */
    .reveal table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
    }
    .reveal table th {
      background-color: rgba(var(--primary-color-rgb), 0.2);
      color: var(--primary-color);
      font-weight: bold;
      text-align: left;
      padding: 0.7em;
      border: 1px solid rgba(var(--primary-color-rgb), 0.3);
      font-size: 1.1em;
    }
    .reveal table td {
      padding: 0.7em;
      border: 1px solid rgba(var(--primary-color-rgb), 0.2);
      font-size: 1.1em;
    }
    .reveal table tr:nth-child(even) {
      background-color: rgba(var(--primary-color-rgb), 0.05);
    }
    
    /* Section title slides */
    .reveal section.section-title {
      background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.15) 0%, rgba(255,255,255,0.95) 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2em;
    }
    
    .reveal section.section-title h1,
    .reveal section.section-title h2 {
      font-size: 3em;
      margin-bottom: 0.3em;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    
    /* Title slide */
    .reveal section.title-slide {
      background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2em;
    }
    
    .reveal section.title-slide h1 {
      font-size: 3.2em;
      margin-bottom: 0.2em;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .reveal section.title-slide h2 {
      font-size: 1.8em;
      color: var(--secondary-color);
      font-weight: 500;
      margin-bottom: 1.5em;
    }
    
    /* Horizontal divider */
    .reveal hr {
      border: 0;
      height: 3px;
      background: linear-gradient(to right, transparent, var(--primary-color), transparent);
      margin: 1.5em 0;
    }
  `;
};
