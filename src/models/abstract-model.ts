import { v4 as UUID } from 'uuid';

abstract class AbstractModel {
    public id: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor() {
        this.id = UUID();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

export default AbstractModel;