import type { Deck, Card } from './types';

export interface CSVRow {
  deckName: string;
  question: string;
  answer: string;
}

export interface ParsedCSVData {
  [deckName: string]: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Parse CSV content with deckName, question, answer columns
 */
export function parseCSV(csvContent: string): ParsedCSVData {
  const lines = csvContent.trim().split('\n');
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse header
  const header = lines[0].split(',').map(col => col.trim().replace(/"/g, ''));
  const deckNameIndex = header.findIndex(col => col.toLowerCase().includes('deck'));
  const questionIndex = header.findIndex(col => col.toLowerCase().includes('question'));
  const answerIndex = header.findIndex(col => col.toLowerCase().includes('answer'));

  if (deckNameIndex === -1 || questionIndex === -1 || answerIndex === -1) {
    throw new Error('CSV must contain columns for deckName, question, and answer');
  }

  const parsedData: ParsedCSVData = {};
  let rowNumber = 1;

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    rowNumber++;
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const columns = parseCSVLine(line);
    
    if (columns.length < 3) {
      console.warn(`Row ${rowNumber}: Not enough columns, skipping`);
      continue;
    }

    const deckName = (columns[deckNameIndex] || '').trim();
    const question = (columns[questionIndex] || '').trim();
    const answer = (columns[answerIndex] || '').trim();

    if (!deckName || !question || !answer) {
      console.warn(`Row ${rowNumber}: Missing required data, skipping`);
      continue;
    }

    if (!parsedData[deckName]) {
      parsedData[deckName] = [];
    }

    parsedData[deckName].push({ question, answer });
  }

  if (Object.keys(parsedData).length === 0) {
    throw new Error('No valid cards found in CSV file');
  }

  return parsedData;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result.map(col => col.replace(/^"|"$/g, '')); // Remove surrounding quotes
}

/**
 * Generate CSV content from cards grouped by deck
 */
export function generateCSV(decksWithCards: Array<{ deck: Deck; cards: Card[] }>): string {
  const rows: CSVRow[] = [];
  
  for (const { deck, cards } of decksWithCards) {
    for (const card of cards) {
      rows.push({
        deckName: deck.name,
        question: card.question,
        answer: card.answer,
      });
    }
  }

  if (rows.length === 0) {
    throw new Error('No cards to export');
  }

  // Generate CSV content
  const header = 'deckName,question,answer';
  const csvLines = [header];

  for (const row of rows) {
    const line = [
      escapeCSVValue(row.deckName),
      escapeCSVValue(row.question),
      escapeCSVValue(row.answer),
    ].join(',');
    csvLines.push(line);
  }

  return csvLines.join('\n');
}

/**
 * Escape CSV value by wrapping in quotes if necessary
 */
function escapeCSVValue(value: string): string {
  // Wrap in quotes if value contains comma, newline, or quote
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    // Escape quotes by doubling them
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return value;
}

/**
 * Trigger CSV file download in the browser
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Read file content as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Validate file is a CSV
 */
export function validateCSVFile(file: File): void {
  if (!file) {
    throw new Error('No file selected');
  }
  
  if (!file.name.toLowerCase().endsWith('.csv')) {
    throw new Error('Please select a CSV file');
  }
  
  if (file.size === 0) {
    throw new Error('File is empty');
  }
  
  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }
}