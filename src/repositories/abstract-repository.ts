import AbstractModel from '@models/abstract-model';
import Cache from '@objects/cache';
import fs from 'fs';
import path from 'path';

type Constructor<T extends AbstractModel> = new (...args: any[]) => T;

export abstract class AbstractRepository<T extends AbstractModel> {
    private readonly ENCODING: BufferEncoding = 'utf-8';
    private readonly JSON_SPACE: number = 2;

    private type: Constructor<T>;
    private filePath: string;

    constructor(filename: string, type: Constructor<T>) {
        this.type = type;

        this.filePath = path.join(__dirname, filename);
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '', this.ENCODING);
        }
    }

    protected readDataFromCache(): T[] {
        if (Cache.has(this.type)) {
            return Cache.get(this.type) as T[];
        }
    }

    protected readDataFromFile(): T[] {
        const data = fs.readFileSync(this.filePath, this.ENCODING);
        if (data) {
            const parsedData: T[] = JSON.parse(data);
            return parsedData;
        }
    }

    protected appendData(data: T[]): void {
        const jsonData = JSON.stringify(data, null, this.JSON_SPACE);
        fs.appendFileSync(this.filePath, jsonData, this.ENCODING);
        Cache.add(this.type, data);
    }

    protected removeData(id: string): void {
        const data = this.readDataFromCache() || this.readDataFromFile();
        const filteredData = data.filter((item: any) => item.id !== id);
        const jsonData = JSON.stringify(filteredData, null, this.JSON_SPACE)
        fs.writeFileSync(this.filePath, jsonData, this.ENCODING);
        this.setCache(filteredData);
    }

    protected setCache(data: T[]): void {
        Cache.set(this.type, data);
    }

}
