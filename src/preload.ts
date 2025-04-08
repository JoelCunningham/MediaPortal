import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('Electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    on: (channel: string, listener: (...args: any[]) => void) =>
      ipcRenderer.on(channel, (event, ...args) => listener(...args)),
  },
});
