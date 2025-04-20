import { Endpoint } from "@collections/types";

class Request {
    static async send<T extends Endpoint>(endpoint: T, ...args: any[]) {        
        return await window.Electron.ipcRenderer.invoke(endpoint, ...args);
    }
}

export default Request;
