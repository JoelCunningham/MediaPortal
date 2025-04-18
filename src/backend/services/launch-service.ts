import Shortcut from "@models/shortcut-model";
import { completeUrl } from "@utilities/url-utilities";

import { execFile } from "child_process";
import { BrowserWindow } from "electron";

class LaunchService {

    public static launchApp(shortcut: Shortcut): void {
        try {
            execFile(shortcut.location, (error: Error) => {
                if (error) throw new Error(error.message);
            });
        } catch (err) {
            console.error('Error launching app:', err);
        }
    }

    public static launchWeb(shortcut: Shortcut): void {
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
            console.error('Error launching web app:', err);
        }
    }
}

export default LaunchService;
