type Constructor<T> = new (...args: any[]) => T;

class DataCache {
  private cache = new Map<Function, any>();

  set<T>(type: Constructor<T>, value: T[]) {
    this.cache.set(type, value);
  }

  get<T>(type: Constructor<T>): T[] {
    return this.cache.get(type);
  }

  add<T>(type: Constructor<T>, value: T[]) {
    const existing = this.cache.get(type) || [];
    this.cache.set(type, [...existing, ...value]);
  } 

  has<T>(type: Constructor<T>): boolean {
    return this.cache.has(type);
  }
}

export default new DataCache();
