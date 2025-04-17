import ShortcutModel from '@models/shortcut-model';
import { AbstractRepository } from '@repositories/abstract-repository';

class ShortcutRepository extends AbstractRepository<ShortcutModel> {

    constructor() {
        super('shortcut.json', ShortcutModel);
    }

    public getShortcuts(): ShortcutModel[] {
        let shortcuts = super.readDataFromCache();
        if (!shortcuts) {
            const fileData = super.readDataFromFile();
            shortcuts = fileData ? fileData.map(ShortcutModel.createFrom) : [];
            this.setCache(shortcuts);
        }
        return shortcuts;
    }

    public addShortcuts(shortcuts: ShortcutModel[]): void {
        shortcuts = shortcuts.map(ShortcutModel.createFrom);
        this.appendData(shortcuts);
    }

    public removeShortcut(id: string): void {
        this.removeData(id);
    }
}

export default new ShortcutRepository();
