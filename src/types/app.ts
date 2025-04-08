class App {
    id: number;
    name: string = '';
    location: string = '';
    isWeb: boolean = false;
    position: number = -1;
}

const guessName = (location: string) => {
    return location.split("\\").pop().replace(/\.[^/.]+$/, '') || '';
}

const getIcon = async (location: string) => {
    return window.Electron.ipcRenderer.invoke('get-icon', location).then((dataUrl: string) => {
        return dataUrl ? dataUrl : '';
    });
}

export default App;

export {
    getIcon, 
    guessName,
};
