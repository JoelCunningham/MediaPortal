import AbstractModel from '@models/abstract-model';
import { DATA_DIR } from '@objects/constants';
import fs from 'fs';
import path from 'path';

abstract class AbstractRepository<T extends AbstractModel> {
    private readonly ENCODING: BufferEncoding = 'utf-8';
    private readonly JSON_SPACE: number = 2;

    private filePath: string;

    constructor(filename: string) {
        this.filePath = path.join(DATA_DIR, filename);
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '', this.ENCODING);
        }
    }

    protected readData(): T[] {
        const data = fs.readFileSync(this.filePath, this.ENCODING);
        if (data) {
            return JSON.parse(data) as T[];
        }
        return [] as T[];
    }

    protected appendData(data: T[]): void {
        const existingData = this.readData();
        const allData = [...existingData, ...data];
        const jsonData = JSON.stringify(allData, null, this.JSON_SPACE);
        fs.writeFileSync(this.filePath, jsonData, this.ENCODING);
    }

    protected removeData(id: string): void {
        const existingData = this.readData();
        const filteredData = existingData.filter((item: any) => item.id !== id);
        const jsonData = JSON.stringify(filteredData, null, this.JSON_SPACE)
        fs.writeFileSync(this.filePath, jsonData, this.ENCODING);
    }
}

export default AbstractRepository;