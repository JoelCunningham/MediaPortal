import AbstractModel from '@models/abstract-model';
import Shortcut from '@models/shortcut-model';

class ShortcutInstance extends AbstractModel {
    public base: Shortcut
    public isLoading: boolean = false

    constructor(base: Shortcut) {
        super();
        this.base = base;
    }
}

export default ShortcutInstance;