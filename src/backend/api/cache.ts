import { CacheKey } from "@objects/types";
import { IpcMainProcessor } from "@objects/types";

class RouteCache {
  private cache = new Map<CacheKey, any>();

  private static createKey(endpoint: string, instructions: IpcMainProcessor): CacheKey {
    return `${endpoint}::${JSON.stringify(instructions)}`;
  }

  public has(endpoint: string, instructions: IpcMainProcessor): boolean {
    const key = RouteCache.createKey(endpoint, instructions);
    return this.cache.has(key);
  }

  public get<T>(endpoint: string, instructions: IpcMainProcessor): T[] | undefined {
    const key = RouteCache.createKey(endpoint, instructions);
    return this.cache.get(key);
  }

  public set<T>(endpoint: string, instructions: IpcMainProcessor, value: T[]): void {
    const key = RouteCache.createKey(endpoint, instructions);
    this.cache.set(key, value);
  }

}

export default new RouteCache();
