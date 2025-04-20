import AbstractModel from '@models/abstract-model';
import { DATA_DIR, FILE_ENCODING, JSON_SPACE } from '@collections/constants';
import fs from 'fs';
import path from 'path';

abstract class AbstractRepository<T extends AbstractModel> {
    private filePath: string;

    constructor(filename: string) {
        this.filePath = path.join(DATA_DIR, filename);
        if (!fs.existsSync(this.filePath)) {
            this.saveData([]);
        }
    }

    protected readData(): T[] {
        const data = fs.readFileSync(this.filePath, FILE_ENCODING);
        if (data) {
            return JSON.parse(data) as T[];
        }
        return [] as T[];
    }

    protected appendData(data: T[]): void {
        const existingData = this.readData();
        const allData = [...existingData, ...data];
        this.saveData(allData);
    }

    protected removeData(id: string): void {
        const existingData = this.readData();
        const filteredData = existingData.filter((item: any) => item.id !== id);
        this.saveData(filteredData);
    }

    private saveData(data: T[]): void {
        const jsonData = JSON.stringify(data, null, JSON_SPACE);
        fs.writeFileSync(this.filePath, jsonData, FILE_ENCODING);
    }
}

export default AbstractRepository;