import Route from "@api/route";
import ShortcutModel from "@models/shortcut-model";
import { LaunchRoute, ShortcutType } from "@objects/enums";
import LaunchService from "@services/launch-service";

new Route<LaunchRoute>(LaunchRoute.RUN, async (shortcut: ShortcutModel) => {
    if (shortcut.type === ShortcutType.APP) {
        LaunchService.launchApp(shortcut);
    } else if (shortcut.type === ShortcutType.WEB) {
        LaunchService.launchWeb(shortcut);
    }
});