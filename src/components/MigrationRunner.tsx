'use client';

import { useMigrations } from '../../hooks/use-migrations';

export default function MigrationRunner() {
	// Run database migrations on app startup
	useMigrations();
	return null;
}
