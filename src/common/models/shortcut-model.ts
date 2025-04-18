import AbstractModel from "@models/abstract-model";
import { IconRoute, ShortcutType } from "@objects/enums";
import { v4 as UUID } from 'uuid';
import Request from "@api/request";

class ShortcutModel extends AbstractModel {
    public name: string;
    public location: string;
    public type: ShortcutType;
    public position: number;

    public icon: string;
    public instance: string;

    constructor(name: string, location: string, type: ShortcutType, position: number) {
        super();
        this.name = name;
        this.location = location;
        this.type = type;
        this.position = position;
    }

    public static createBlank(): ShortcutModel {
        return new ShortcutModel("", "", ShortcutType.APP, 0);
    }

    public static createFrom(shortcut: ShortcutModel): ShortcutModel {
        const newShortcut = new ShortcutModel(shortcut.name, shortcut.location, shortcut.type, shortcut.position);
        newShortcut.icon = shortcut.icon;
        newShortcut.instance = shortcut.instance;
        return newShortcut;
    }

    public createInstance(): ShortcutModel {
        const instance = new ShortcutModel(this.name, this.location, this.type, this.position);
        instance.icon = this.icon;
        instance.instance = UUID();
        return instance;
    }

    public guessName(): void {
        if (this.type === ShortcutType.APP) {
            this.name = this.location.split('\\').pop().replace(/\.[^/.]+$/, '') || '';
        }
        this.name = '';
    }

    public update({
        name = this.name,
        location = this.location,
        type = this.type,
        position = this.position,
        icon = this.icon,
        instance = this.instance
    }): ShortcutModel {
        const updatedShortcut = new ShortcutModel(name, location, type, position);
        updatedShortcut.icon = icon;
        updatedShortcut.instance = instance;
        return updatedShortcut;
    }

    public async initialise(): Promise<void> {
        this.icon = await Request.send(IconRoute.GET, this.location, this.type);
    }

}

export default ShortcutModel;
