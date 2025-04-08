import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { ipcMain } from 'electron';
import App from '../types/app';
import * as schema from './schema';

const sqlite = new Database('src/database/database.db');
export const db = drizzle(sqlite, { schema });

ipcMain.handle('get-apps', async () => {
    return db.select().from(schema.apps).all();
});

ipcMain.handle('add-app', async (event, app: App) => {
    return db.insert(schema.apps).values(app).run();
});