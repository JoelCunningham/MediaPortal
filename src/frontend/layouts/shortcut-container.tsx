import { useCredentialContext } from '@contexts/credential-context';
import { useNavigationContext } from '@contexts/navigation-context';
import ShortcutInstance from '@models/shortcut-instance-model';
import AutoFillScript from '@scripts/auto-fill-script';
import DetectCredentialsScript from '@scripts/detect-credentials-script';
import { completeUrl } from '@utilities/url-utilities';
import React, { useEffect, useRef } from 'react';

const ShortcutContainer = () => {
    const { openShortcuts, currShortcut, setIsLoading } = useNavigationContext();
    const { getCredentials, getDefaultCredentials } = useCredentialContext();
    const isAppActive = !!currShortcut;
    const webviewRefs = useRef<Record<string, Electron.WebviewTag>>({});

    const detectCredentials = (webview: Electron.WebviewTag, shortcut: ShortcutInstance) => {
        return DetectCredentialsScript.execute(webview).then((detected: boolean) => {
            if (detected) {
                const webview = webviewRefs.current[shortcut.id];
                let credentials = getCredentials(shortcut.base.location);
                if (credentials.length > 0) {
                    AutoFillScript.execute(webview, credentials, true, shortcut.base.icon);
                } else {
                    credentials = getDefaultCredentials();
                    AutoFillScript.execute(webview, credentials, false);
                }
            }
            return detected;
        });
    };

    const safeDetectCredentials = (webview: Electron.WebviewTag, shortcut: ShortcutInstance) => {
        const found = detectCredentials(webview, shortcut);
        if (!found) {
            setTimeout(() => {
                detectCredentials(webview, shortcut);
            }, 500);
        }
    };

    useEffect(() => {
        const webview = currShortcut ? webviewRefs.current[currShortcut.id] : null;
        if (webview && currShortcut) {
            const detect = () => safeDetectCredentials(webview, currShortcut);
            const handleStartLoading = () => setIsLoading(currShortcut.id, true);
            const handleStopLoading = () => setIsLoading(currShortcut.id, false);

            webview.addEventListener('did-navigate', detect);
            webview.addEventListener('dom-ready', detect);
            webview.addEventListener('did-start-loading', handleStartLoading);
            webview.addEventListener('did-stop-loading', handleStopLoading);

            return () => {
                webview.removeEventListener('did-navigate', detect);
                webview.removeEventListener('dom-ready', detect);
                webview.removeEventListener('did-start-loading', handleStartLoading);
                webview.removeEventListener('did-stop-loading', handleStopLoading);
            };
        }
    }, [currShortcut]);

    return (
        <div className={`h-full ${!isAppActive && 'hidden'}`}>
            {openShortcuts.map((shortcut) => {
                const isShown = currShortcut?.id === shortcut.id;
                const isLoading = shortcut.isLoading;

                return (
                    <div key={shortcut.id} className={`relative h-full ${!isShown && 'hidden'}`}>
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ backgroundColor: shortcut.base.colour }}>
                                <div className="w-24 h-24 border-8 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        <webview
                            ref={(el) => {
                                if (el) webviewRefs.current[shortcut.id] = el as Electron.WebviewTag;
                            }}
                            src={completeUrl(shortcut.base.location)}
                            preload='main_window/preload.js'
                            useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ShortcutContainer;