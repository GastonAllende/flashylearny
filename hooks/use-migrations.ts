import { useEffect, useState } from 'react';
import { migrateInitializeAllProgress } from '../lib/db';

/**
 * Hook to run database migrations on app startup
 * Automatically runs once when the app loads
 */
export function useMigrations() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<{
    cardsProcessed: number;
    progressCreated: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const runMigrations = async () => {
      // Check if migrations have already run in this session
      const migrationsKey = 'flashylearny_migrations_v1';
      const hasRun = sessionStorage.getItem(migrationsKey);

      if (hasRun) {
        setStatus('success');
        return;
      }

      try {
        setStatus('running');

        // Run migration to initialize progress for all cards
        const migrationResult = await migrateInitializeAllProgress();

        if (isMounted) {
          setResult(migrationResult);
          setStatus('success');

          // Mark migrations as complete for this session
          sessionStorage.setItem(migrationsKey, 'true');

          // Log migration results (useful for debugging)
          if (migrationResult.progressCreated > 0) {
            console.log(
              `[Migration] Created ${migrationResult.progressCreated} progress records for ${migrationResult.cardsProcessed} cards`
            );
          }
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Migration failed');
          setError(error);
          setStatus('error');
          console.error('[Migration] Failed to run migrations:', error);
        }
      }
    };

    runMigrations();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    status,
    error,
    result,
    isRunning: status === 'running',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}
