import Shortcut from '@models/shortcut-model';
import AbstractRepository from '@repositories/abstract-repository';

class ShortcutRepository extends AbstractRepository<Shortcut> {
    private static readonly REPOSITORY_FILE = 'shortcut.json';

    constructor() {
        super(ShortcutRepository.REPOSITORY_FILE);
    }

    public getShortcuts(): Shortcut[] {
        return this.readData();
    }

    public addShortcuts(shortcuts: Shortcut[]): void {
        this.appendData(shortcuts);
    }

    public removeShortcut(id: string): void {
        this.removeData(id);
    }
}

export default new ShortcutRepository();
