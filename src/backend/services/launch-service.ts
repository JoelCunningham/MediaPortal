import Shortcut from '@models/shortcut-model';

import { execFile } from 'child_process';

class LaunchService {

    public static launchApp(shortcut: Shortcut): void {
        try {
            execFile(shortcut.location, (error: Error) => {
                if (error) throw new Error(error.message);
            });
        } catch (error) { }
    }
}

export default LaunchService;
