
import { ThemeColors } from "./ThemeColors";

export interface RevealPreviewProps {
  slidesHtml: string;
  onColorChange?: (colors: ThemeColors) => void;
}

export interface ThemeOption {
  name: string;
  value: string;
}

export interface TransitionOption {
  name: string;
  value: string;
}

// Available themes in reveal.js
export const themes: ThemeOption[] = [
  { name: 'White', value: 'white' },
  { name: 'Black', value: 'black' },
  { name: 'League', value: 'league' },
  { name: 'Beige', value: 'beige' },
  { name: 'Sky', value: 'sky' },
  { name: 'Night', value: 'night' },
  { name: 'Serif', value: 'serif' },
  { name: 'Simple', value: 'simple' },
  { name: 'Solarized', value: 'solarized' },
  { name: 'Blood', value: 'blood' },
  { name: 'Moon', value: 'moon' },
];

// Transition options
export const transitions: TransitionOption[] = [
  { name: 'None', value: 'none' },
  { name: 'Fade', value: 'fade' },
  { name: 'Slide', value: 'slide' },
  { name: 'Convex', value: 'convex' },
  { name: 'Concave', value: 'concave' },
  { name: 'Zoom', value: 'zoom' },
];
