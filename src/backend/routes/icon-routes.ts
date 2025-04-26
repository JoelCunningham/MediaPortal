import Route from '@api/route';
import { IconRoute, ShortcutType } from '@collections/enums';
import IconService from '@services/icon-service';

new Route<IconRoute>(IconRoute.GET, async (location: string, type: ShortcutType) => {
    let icon = '';
    if (type === ShortcutType.APP) {
        icon = IconService.getAppIcon(location);
    } else if (type === ShortcutType.WEB) {
        icon = await IconService.getWebIcon(location);
    }
    return icon;
});