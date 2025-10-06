import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import {
  parseCSV,
  generateCSV,
  downloadCSV,
  readFileAsText,
  validateCSVFile,
  type ParsedCSVData,
} from '@/lib/csv';
import {
  importDecksWithCards,
  exportDeck,
  exportAllDecks,
} from '@/lib/db';

/**
 * Hook to import CSV data and create decks/cards
 */
export function useImportCSV() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      // Validate file
      validateCSVFile(file);
      
      // Read file content
      const csvContent = await readFileAsText(file);
      
      // Parse CSV
      const parsedData: ParsedCSVData = parseCSV(csvContent);
      
      // Convert to format expected by importDecksWithCards
      const decksData = Object.entries(parsedData).map(([deckName, cards]) => ({
        deckName,
        cards,
      }));
      
      // Import to database
      const result = await importDecksWithCards(decksData);
      
      return {
        ...result,
        decksData: Object.keys(parsedData),
      };
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['deckProgress'] });
      queryClient.invalidateQueries({ queryKey: ['deckCompletion'] });
    },
  });
}

/**
 * Hook to export a single deck as CSV
 */
export function useExportDeck() {
  return useMutation({
    mutationFn: async ({ deckId, filename }: { deckId: string; filename?: string }) => {
      // Get deck and cards data
      const deckData = await exportDeck(deckId);
      
      // Generate CSV content
      const csvContent = generateCSV([deckData]);
      
      // Generate filename if not provided
      const csvFilename = filename || `${deckData.deck.name.replace(/[^a-zA-Z0-9]/g, '_')}_cards.csv`;
      
      // Trigger download
      downloadCSV(csvContent, csvFilename);
      
      return {
        deckName: deckData.deck.name,
        cardCount: deckData.cards.length,
        filename: csvFilename,
      };
    },
  });
}

/**
 * Hook to export all decks as CSV
 */
export function useExportAllDecks() {
  return useMutation({
    mutationFn: async ({ filename }: { filename?: string } = {}) => {
      // Get all decks and cards data
      const allDecksData = await exportAllDecks();
      
      if (allDecksData.length === 0) {
        throw new Error('No decks found to export');
      }
      
      // Generate CSV content
      const csvContent = generateCSV(allDecksData);
      
      // Generate filename if not provided
      const csvFilename = filename || `flashylearny_all_decks_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Trigger download
      downloadCSV(csvContent, csvFilename);
      
      const totalCards = allDecksData.reduce((sum, { cards }) => sum + cards.length, 0);
      
      return {
        deckCount: allDecksData.length,
        cardCount: totalCards,
        filename: csvFilename,
      };
    },
  });
}