import { ICON_ENCODING, ICON_PATH, ICON_SIZE } from '@collections/constants';
import { completeUrl, isValidUrl } from '@utilities/url-utilities';
import extractIcon from 'extract-file-icon';

class IconService {
    private static readonly FAVICON_SERVICE: string = 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url={url}&size={size}';

    public static getAppIcon(exePath: string): string | null {
        try {
            const iconBuffer = extractIcon(exePath, ICON_SIZE);
            return this.getIconString(iconBuffer);
        } catch (error) {
            return null;
        }
    };

    public static async getWebIcon(urlPath: string): Promise<string | null> {
        try {
            if (!isValidUrl(urlPath)) {
                return null;
            }
            urlPath = completeUrl(urlPath);
            const response = await fetch(this.FAVICON_SERVICE.replace('{url}', urlPath).replace('{size}', ICON_SIZE.toString()));
            if (!response.ok) return null;

            const arrayBuffer = await response.arrayBuffer();
            const iconBuffer = Buffer.from(arrayBuffer);

            return this.getIconString(iconBuffer);
        } catch (error) {
            return null;
        }
    }

    private static getIconString(iconBuffer: Buffer): string {
        return `${ICON_PATH}${ICON_ENCODING},${iconBuffer.toString(ICON_ENCODING)}`;
    }
}

export default IconService;