
import pptxgen from "pptxgenjs";
import { DOMElement, getElementsArrayByTagName, getTextContent } from "../utils";

/**
 * Process HTML tables for PowerPoint
 */
export const processTables = (
  slide: pptxgen.Slide,
  tableElements: DOMElement[],
  startY: number,
  primaryColor: string,
  textColor: string
): number => {
  let currentY = startY;
  
  for (let i = 0; i < tableElements.length; i++) {
    const tableElement = tableElements[i];
    const rows = getElementsArrayByTagName(tableElement, 'tr');
    
    if (rows.length === 0) continue;
    
    // Determine the number of columns based on the first row
    const firstRow = rows[0];
    const headerCells = getElementsArrayByTagName(firstRow, 'th');
    const normalCells = getElementsArrayByTagName(firstRow, 'td');
    const numColumns = Math.max(headerCells.length, normalCells.length);
    
    if (numColumns === 0) continue;
    
    // Prepare table data
    const tableData = [];
    let hasHeaders = false;
    
    for (let j = 0; j < rows.length; j++) {
      const row = rows[j];
      const rowData = [];
      
      // Check if this is a header row
      const headerCells = getElementsArrayByTagName(row, 'th');
      if (headerCells.length > 0) {
        hasHeaders = true;
        for (let k = 0; k < headerCells.length; k++) {
          rowData.push(getTextContent(headerCells[k]));
        }
      } else {
        const cells = getElementsArrayByTagName(row, 'td');
        for (let k = 0; k < cells.length; k++) {
          rowData.push(getTextContent(cells[k]));
        }
      }
      
      tableData.push(rowData);
    }
    
    // Only proceed if we have data
    if (tableData.length > 0) {
      // Width calculations (total width: 9 inches)
      const tableWidth = 9;
      const colWidth = tableWidth / numColumns;
      
      // Options for the table
      const tableOptions: pptxgen.TableOptions = {
        x: 0.5, 
        y: currentY,
        w: tableWidth,
        rowHeight: 0.5,
        colWidth,
        fontFace: 'Arial',
        fontSize: 14,
        color: textColor,
        border: { pt: 1, color: primaryColor + '80' } // Primary color with transparency
      };
      
      // Create table
      const rows = [];
      
      for (let j = 0; j < tableData.length; j++) {
        const row = tableData[j];
        const rowCells = [];
        
        for (let k = 0; k < numColumns; k++) {
          const cellText = row[k] || '';
          
          // Style header rows differently
          const cellOptions: pptxgen.TableCellProps = {};
          
          if ((j === 0 && hasHeaders) || (headerCells.length > 0 && j === 0)) {
            cellOptions.fill = { color: primaryColor + '20' }; // Light primary color
            cellOptions.bold = true;
          } else if (j % 2 === 1) {
            // Zebra striping for data rows
            cellOptions.fill = { color: primaryColor + '08' }; // Very light primary color
          }
          
          rowCells.push({
            text: cellText,
            ...cellOptions
          });
        }
        
        rows.push(rowCells);
      }
      
      // Add the table to the slide
      slide.addTable(rows, tableOptions);
      
      // Update current Y position for next element
      // Height calculation: base (0.7) + rows (num rows * row height)
      currentY += 0.7 + (tableData.length * 0.5);
    }
  }
  
  return currentY;
};
