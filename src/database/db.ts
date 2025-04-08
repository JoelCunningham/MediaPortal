import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { ipcMain } from 'electron';

const sqlite = new Database('src/database/database.db');
export const db = drizzle(sqlite, { schema });

ipcMain.handle('get-apps', async () => {
    return db.select().from(schema.apps).all();
});
