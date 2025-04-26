import { IconSize, JsonSpace } from '@collections/types';

export const HOME_DIR: string = '/main_window';
export const DATA_DIR: string = 'src/backend/data/';

export const ICON_ENCODING: BufferEncoding = 'base64';
export const FILE_ENCODING: BufferEncoding = 'utf-8';

export const JSON_SPACE: JsonSpace = 2;
export const ICON_SIZE: IconSize = 256;
export const ICON_PATH: string = 'data:image/x-icon;';

export const HTTP: string = 'http://';
export const HTTPS: string = 'https://';

export const URL_REGEX: RegExp = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/|$)/

export const APP_EXT: string[] = ['exe', 'app']