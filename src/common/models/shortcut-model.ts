import Request from '@api/request';
import { IconRoute, ShortcutType } from '@collections/enums';
import AbstractModel from '@models/abstract-model';
import ShortcutInstance from '@models/shortcut-instance-model';

class ShortcutModel extends AbstractModel {
    public name: string;
    public location: string;
    public type: ShortcutType;
    public position: number;
    public icon: string;

    public createInstance(): ShortcutInstance {
        return new ShortcutInstance(this);
    }

    public static create(name: string, location: string, type: ShortcutType, position: number, icon: string): ShortcutModel {
        const shortcut = new ShortcutModel();
        shortcut.name = name;
        shortcut.location = location;
        shortcut.type = type;
        shortcut.position = position;
        shortcut.icon = icon;
        return shortcut;
    }

    public update({ name = this.name, location = this.location, type = this.type, position = this.position, icon = this.icon, }): ShortcutModel {
        return ShortcutModel.create(name, location, type, position, icon);
    }

    public guessName(): void {
        if (this.type === ShortcutType.APP && this.location) {
            this.name = this.location.split('\\').pop().replace(/\.[^/.]+$/, '') || '';
        }
        this.name = '';
    }

    public async initialise(): Promise<void> {
        this.icon = await Request.send(IconRoute.GET, this.location, this.type);
    }

}

export default ShortcutModel;
