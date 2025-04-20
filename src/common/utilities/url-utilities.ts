import { HTTP, HTTPS, URL_REGEX } from "@collections/constants";

const isValidUrl = (url: string) => {
    return URL_REGEX.test(url);
}

const completeUrl = (url: string) => {
    if (url.startsWith(HTTP) || url.startsWith(HTTPS)) {
        return url;
    }
    return `${HTTPS}${url}`;
}

export {
    isValidUrl,
    completeUrl,
}