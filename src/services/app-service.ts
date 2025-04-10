import App from '@objects/app';

const iconCache: { [key: string]: string } = {};

const getIcon = async (location: string, isWeb: boolean): Promise<string> => {
    if (iconCache[location]) {
        return iconCache[location];
    }

    const icon = isWeb
        ? await window.Electron.ipcRenderer.invoke('get-web-icon', location)
        : await window.Electron.ipcRenderer.invoke('get-icon', location);

    iconCache[location] = icon;
    return icon;
};

const guessName = (location: string, isWeb: boolean) => {
    const name = isWeb
        ? ''
        : location.split('\\').pop().replace(/\.[^/.]+$/, '') || ''

    return name;
}

const loadIcons = async (apps: App[]) => {
    return await Promise.all(
        apps.map(async (app) => {
            const icon = await getIcon(app.location, app.isWeb);
            return { ...app, icon };
        })
    );
};

export {
    getIcon,
    guessName,
    loadIcons
};
