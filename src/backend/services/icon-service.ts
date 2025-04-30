import { ICON_ENCODING, ICON_PATH, ICON_SIZE } from '@collections/constants';
import { completeUrl, isValidUrl } from '@utilities/url-utilities';
import extractIcon from 'extract-file-icon';
import sharp, { FormatEnum } from 'sharp';

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

    public static async getColourFromIcon(iconBuffer: Buffer): Promise<string> {
        try {
            // Convert the icon to PNG format if it isn't already (e.g., .ico to .png)
            let image = sharp(iconBuffer);
            iconBuffer = await image.png().toBuffer();
    
            // Reinitialize sharp with the PNG buffer for processing
            const { data, info } = await sharp(iconBuffer).raw().toBuffer({ resolveWithObject: true });
    
            let r = 0, g = 0, b = 0;
            const totalPixels = info.width * info.height;
    
            // Loop through pixel data and calculate the average color
            for (let i = 0; i < data.length; i += 3) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }
    
            // Calculate the average RGB values
            r = Math.round(r / totalPixels);
            g = Math.round(g / totalPixels);
            b = Math.round(b / totalPixels);
    
            // Convert the average RGB color to hex format
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } catch (error) {
            console.error('Error extracting color from icon:', error);
            return '#000000'; // Default to black if an error occurs
        }
    }

    private static getIconString(iconBuffer: Buffer): string {
        return `${ICON_PATH}${ICON_ENCODING},${iconBuffer.toString(ICON_ENCODING)}`;
    }
}

export default IconService;