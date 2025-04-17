import { ShortcutType } from '@objects/enums';
import Shortcut from '../models/shortcut-model';

const iconCache: { [key: string]: string } = {};

const getIcon = async (location: string, type: ShortcutType): Promise<string> => {
    if (iconCache[location]) {
        return iconCache[location];
    }

    let icon = '';
    if (type === ShortcutType.APP) {
        icon = await window.Electron.ipcRenderer.invoke('get-icon', location) || '';
    } else if (type === ShortcutType.WEB) {
        icon = await window.Electron.ipcRenderer.invoke('get-web-icon', location) || '';
    }

    iconCache[location] = icon;
    return icon;
};

const guessName = (location: string, type: ShortcutType) => {
    let name = '';
    if (type === ShortcutType.APP) {
        name = location.split('\\').pop().replace(/\.[^/.]+$/, '') || '';
    } else if (type === ShortcutType.WEB) {
        name = '';
    }
    return name;
}

const loadIcons = async (shortcuts: Shortcut[]) => {
    return await Promise.all(
        shortcuts.map(async (shortcut) => {
            const icon = await getIcon(shortcut.location, shortcut.type);
            return shortcut.update({ icon: icon });
        })
    );
};

export {
    getIcon,
    guessName,
    loadIcons
};
