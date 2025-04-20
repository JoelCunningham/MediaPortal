import { CredentialRoute, IconRoute, LaunchRoute, ShortcutRoute } from "@collections/enums";

export type IpcMainProcessor<T = any> = (...args: any[]) => Promise<T> | T;

export type Endpoint = ShortcutRoute | CredentialRoute | IconRoute | LaunchRoute;

export type CacheKey = string;

export type IconSize = 16 | 32 | 64 | 256;
export type JsonSpace = 1 | 2 | 4;