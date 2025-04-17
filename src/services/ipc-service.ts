import ShortcutRepository from "../repositories/shortcut-repository";
import Shortcut from "../models/shortcut-model";
import { completeUrl, isValidUrl } from "@services/url-service";

import { execFile } from "child_process";
import { BrowserWindow, ipcMain } from "electron";
import extractIcon from "extract-file-icon";

ipcMain.handle('get-icon', (_event, exePath: string) => {
    try {
        const iconBuffer = extractIcon(exePath, 256);
        return `data:image/x-icon;base64,${iconBuffer.toString('base64')}`;
    } catch (err) {
        console.error('Failed to extract icon:', err);
        return null;
    }
});

ipcMain.handle('get-web-icon', async (_event, urlPath: string) => {
    const faviconService = 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url={url}&size=256'

    try {
        if (!isValidUrl(urlPath)) {
            return '';
        }
        urlPath = completeUrl(urlPath);

        const response = await fetch(faviconService.replace('{url}', urlPath));
        if (!response.ok) throw new Error(`Failed to fetch icon: ${response.status} ${response.statusText}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return `data:image/x-icon;base64,${buffer.toString('base64')}`;
    } catch (err) {
        console.error('Error fetching web icon:', err);
        return '';
    }
});

ipcMain.handle('launch-shortcut', async (_event, shortcut: Shortcut) => {
    try {
        execFile(shortcut.location, (error: Error) => {
            if (error) throw new Error(error.message);
        });
    } catch (err) {
        console.error('Error launching shortcut:', err);
    }
});

ipcMain.handle('launch-web-shortcut', async (_event, shortcut: Shortcut) => {
    try {
        const win = new BrowserWindow({
            fullscreen: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
            }
        });
        win.loadURL(completeUrl(shortcut.location));
    } catch (err) {
        console.error('Error launching web shortcut:', err);
    }
});

ipcMain.handle('get-shortcuts', async () => {
  return ShortcutRepository.getShortcuts();
});

ipcMain.handle('add-shortcut', async (_event, shortcut: Shortcut) => {
  return ShortcutRepository.addShortcuts([shortcut]);
});
