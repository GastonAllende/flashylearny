/**
 * Generate a unique identifier using crypto.randomUUID()
 * This provides a standard UUID v4 which is suitable for client-side generation
 */
export const uid = (): string => {
  return crypto.randomUUID();
};