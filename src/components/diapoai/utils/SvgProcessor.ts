
/**
 * Processes SVG diagrams in HTML content to ensure proper rendering
 */
export const processSvgDiagrams = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find SVGs that are not already in a diagram container
  const svgs = Array.from(doc.querySelectorAll('svg')).filter(svg => {
    const parent = svg.parentElement;
    return !(parent && (parent.classList.contains('diagram') || parent.classList.contains('svg-diagram')));
  });
  
  // Wrap each SVG in a diagram container
  svgs.forEach(svg => {
    if (svg.parentElement) {
      const wrapper = document.createElement('div');
      wrapper.className = 'svg-diagram';
      svg.parentElement.insertBefore(wrapper, svg);
      wrapper.appendChild(svg);
    }
  });
  
  return doc.body.innerHTML;
};
