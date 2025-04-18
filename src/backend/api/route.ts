import { Endpoint, IpcMainProcessor } from "@objects/types";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import Cache from "@api/cache";

class Route<T extends Endpoint> {
  constructor(endpoint: T, instructions: IpcMainProcessor, cache: boolean = false) {
    ipcMain.handle(endpoint, async (_event: IpcMainInvokeEvent, ...args: any[]) => {
      return await instructions(...args);
    });
  }
}

export default Route;
