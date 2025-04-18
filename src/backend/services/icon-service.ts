import extractIcon from 'extract-file-icon';
import { isValidUrl, completeUrl } from '@utilities/url-utilities';

class IconService {

    public static getAppIcon(exePath: string): string | null {
        try {
            const iconBuffer = extractIcon(exePath, 256);
            return `data:image/x-icon;base64,${iconBuffer.toString('base64')}`;
        } catch (err) {
            console.error('Failed to extract icon:', err);
            return null;
        }
    };

    public static async getWebIcon(urlPath: string): Promise<string | null> {
        const faviconService = 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url={url}&size=256'
        try {
            if (!isValidUrl(urlPath)) {
                return null;
            }
            urlPath = completeUrl(urlPath);
            const response = await fetch(faviconService.replace('{url}', urlPath));
            if (!response.ok) throw new Error(`Failed to fetch icon: ${response.status} ${response.statusText}`);

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            return `data:image/x-icon;base64,${buffer.toString('base64')}`;
        } catch (err) {
            console.error('Error fetching web icon:', err);
            return null;
        }
    }
}

export default IconService;