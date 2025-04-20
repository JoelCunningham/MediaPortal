import { useNavigationContext } from '@contexts/navigation';
import { completeUrl } from '@utilities/url-utilities';
import React, { useRef } from 'react';

const ShortcutContainer = () => {
    const { openShortcuts, currShortcut } = useNavigationContext();
    const isAppActive = !!currShortcut;
    const webviewRefs = useRef<Record<string, Electron.WebviewTag>>({});

    const autofill = (instanceId: string, username: string, password: string) => {
        const webview = webviewRefs.current[instanceId];
        if (webview) {
            webview.executeJavaScript(`
                (() => {
                    function setNativeValue(element, value) {
                        const lastValue = element.value;
                        element.value = value;
                        const event = new Event('input', { bubbles: true });
                        event.simulated = true;
                        const tracker = element._valueTracker;
                        if (tracker) {
                            tracker.setValue(lastValue);
                        }
                        element.dispatchEvent(event);
                    }

                    const usernameField = document.querySelector('input[type="email"], input[name*="email"], input[name*="username"]');
                    const passwordField = document.querySelector('input[type="password"]');

                    if (usernameField) setNativeValue(emailField, ${JSON.stringify(username)});
                    if (passwordField) setNativeValue(passwordField, ${JSON.stringify(password)});
                })();
            `)
        }
    };

    return (
        <div className={`h-full ${!isAppActive && 'hidden'}`}>
            {openShortcuts.map((shortcut) => {
                const isShown = currShortcut?.id === shortcut.id;

                return (
                    <div
                        key={shortcut.id}
                        className={`h-full ${!isShown && 'hidden'}`}
                    >
                        <webview
                            ref={(el) => {
                                if (el) webviewRefs.current[shortcut.id] = el as Electron.WebviewTag;
                            }}
                            src={completeUrl(shortcut.base.location)}
                            preload='main_window/preload.js'
                            useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                            style={{ width: '100%', height: '100%' }}
                        />
                        <button
                            onClick={() =>
                                autofill(shortcut.id, 'your@email.com', 'password123')
                            }
                        >
                            Autofill
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ShortcutContainer;