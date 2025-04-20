import Route from "@api/route";
import Shortcut from "@models/shortcut-model";
import { ShortcutRoute } from "@collections/enums";
import ShortcutRepository from "@repositories/shortcut-repository";

new Route<ShortcutRoute>(ShortcutRoute.GET, async () => {
    return ShortcutRepository.getShortcuts();
});

new Route<ShortcutRoute>(ShortcutRoute.ADD, async (shortcut: Shortcut) => {
    return ShortcutRepository.addShortcuts([shortcut]);
});

new Route<ShortcutRoute>(ShortcutRoute.REMOVE, async (id: string) => {
    return ShortcutRepository.removeShortcut(id);
});
