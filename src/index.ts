import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import extractIcon from 'extract-file-icon';
import './database/db';

// This allows TypeScript to pick up constants auto-generated by Forge's Webpack plugin
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

app.on('ready', createWindow);

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [{ name: 'Executables', extensions: ['exe', 'app'] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }

  throw new Error('No file selected');
});

ipcMain.handle('get-icon', (_event, exePath: string) => {
  try {
    const iconBuffer = extractIcon(exePath, 256);
    return `data:image/png;base64,${iconBuffer.toString('base64')}`;
  } catch (err) {
    console.error('Failed to extract icon:', err);
    return null;
  }
});

ipcMain.handle('get-web-icon', async (_event, urlPath: string) => {
  const faviconService = 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url={url}&size=256'

  try {
    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/|$)/.test(urlPath)) {
      return '';
    }
    if (!/^https?:\/\//i.test(urlPath)) {
      urlPath = `https://${urlPath}`;
    }

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