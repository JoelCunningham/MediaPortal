import { useNavigationContext } from '@contexts/navigation';
import { completeUrl } from '@utilities/url-utilities';
import React, { useRef } from 'react';

const ShortcutContainer = () => {
    const { openShortcuts, currShortcut } = useNavigationContext();
    const isAppActive = !!currShortcut;
    const webviewRefs = useRef<Record<string, Electron.WebviewTag>>({});

    const autofill = (instanceId: string, email: string, password: string) => {
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

                    const emailField = document.querySelector('input[type="email"], input[name*="email"], input[name*="username"]');
                    const passwordField = document.querySelector('input[type="password"]');

                    if (emailField) setNativeValue(emailField, ${JSON.stringify(email)});
                    if (passwordField) setNativeValue(passwordField, ${JSON.stringify(password)});
                })();
            `)
        }
    };

    return (
        <div className={`h-full ${!isAppActive && 'hidden'}`}>
            {openShortcuts.map((shortcut) => {
                const isShown = currShortcut?.instance === shortcut.instance;

                return (
                    <div
                        key={shortcut.instance}
                        className={`h-full ${!isShown && 'hidden'}`}
                    >
                        <webview
                            ref={(el) => {
                                if (el) webviewRefs.current[shortcut.instance] = el as Electron.WebviewTag;
                            }}
                            src={completeUrl(shortcut.location)}
                            preload='main_window/preload.js'
                            useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                            style={{ width: '100%', height: '100%' }}
                        />
                        <button
                            onClick={() =>
                                autofill(shortcut.instance, 'your@email.com', 'password123')
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