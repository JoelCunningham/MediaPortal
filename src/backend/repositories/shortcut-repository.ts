import ShortcutModel from '@models/shortcut-model';
import AbstractRepository from '@repositories/abstract-repository';

class ShortcutRepository extends AbstractRepository<ShortcutModel> {

    constructor() {
        super('shortcut.json');
    }

    public getShortcuts(): ShortcutModel[] {
        return this.readData();
    }

    public addShortcuts(shortcuts: ShortcutModel[]): void {
        shortcuts.map(shortcut => {
            shortcut.icon = '';
            shortcut.instance = '';
        });
        this.appendData(shortcuts);
    }

    public removeShortcut(id: string): void {
        this.removeData(id);
    }
}

export default new ShortcutRepository();
