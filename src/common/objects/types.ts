import { IconRoute, LaunchRoute, ShortcutRoute } from "./enums";

export type IpcMainProcessor<T = any> = (...args: any[]) => Promise<T> | T;

export type Endpoint = ShortcutRoute | IconRoute | LaunchRoute;

export type CacheKey = string;