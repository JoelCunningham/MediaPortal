import { IconRoute, LaunchRoute, ShortcutRoute } from "@objects/enums";

export type IpcMainProcessor<T = any> = (...args: any[]) => Promise<T> | T;

export type Endpoint = ShortcutRoute | IconRoute | LaunchRoute;

export type CacheKey = string;

export type IconSize = 16 | 32 | 64 | 256;
export type JsonSpace = 1 | 2 | 4;