
/**
 * Utility for downloading HTML content as a file
 */
export const downloadHtmlFile = (htmlContent: string, filename: string = 'diapoai-presentation.html'): void => {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
