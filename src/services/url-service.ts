const isValidUrl = (url: string) => {
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/|$)/.test(url);
}

const completeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
}

export {
    isValidUrl,
    completeUrl,
}