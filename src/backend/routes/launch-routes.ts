import Route from '@api/route';
import Shortcut from '@models/shortcut-model';
import { LaunchRoute, ShortcutType } from '@collections/enums';
import LaunchService from '@services/launch-service';

new Route<LaunchRoute>(LaunchRoute.RUN, async (shortcut: Shortcut) => {
    if (shortcut.type === ShortcutType.APP) {
        LaunchService.launchApp(shortcut);
    } 
});