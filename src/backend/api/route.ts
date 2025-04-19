import { Endpoint, IpcMainProcessor } from "@objects/types";
import { ipcMain, IpcMainInvokeEvent } from "electron";

class Route<T extends Endpoint> {
  constructor(endpoint: T, instructions: IpcMainProcessor) {
    ipcMain.handle(endpoint, async (_event: IpcMainInvokeEvent, ...args: any[]) => {
      return await instructions(...args);
    });
  }
}

export default Route;
