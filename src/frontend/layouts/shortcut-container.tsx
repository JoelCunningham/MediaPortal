import { useNavigationContext } from '@contexts/navigation';
import ShortcutInstance from '@models/shortcut-instance-model';
import { completeUrl } from '@utilities/url-utilities';
import React, { useEffect, useRef } from 'react';

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

                    function style(element) {
                        element.style.border = '2px solid green';
                        element.style.color = '#000';
                        element.style.backgroundColor = '#e6ffe6';
                    }

                    const usernameField = document.querySelector('input[type="email"], input[name*="email"], input[name*="username"]');
                    const passwordField = document.querySelector('input[type="password"]');
                    const submitButton = document.querySelector('button[type="submit"], input[type="submit"]');

                    if (usernameField) {
                        setNativeValue(usernameField, ${JSON.stringify(username)});
                        style(usernameField);
                        usernameField.focus();
                    }
                    if (passwordField) {
                        setNativeValue(passwordField, ${JSON.stringify(password)});
                        style(passwordField);
                        passwordField.focus();
                    }

                    if (submitButton && (usernameField || passwordField)) {
                        submitButton.focus();
                    }
                })();
            `)
        }
    };

    const detectCredentials = (webview: Electron.WebviewTag, shortcut: ShortcutInstance) => {
        webview.executeJavaScript(`
            (() => {
              const hasUsername = document.querySelector('input[type="email"], input[name*="email"], input[name*="username"]');
              const hasPassword = document.querySelector('input[type="password"]');
              return !!(hasUsername || hasPassword);
            })();
        `).then((detected: boolean) => {
            if (detected) {
                autofill(shortcut.id, 'your@email.com', 'password123');
            }
        });
    };

    useEffect(() => {
        const webview = currShortcut ? webviewRefs.current[currShortcut.id] : null;
        if (webview) {
            const detect = () => detectCredentials(webview, currShortcut);
            webview.addEventListener('did-navigate', detect);
            webview.addEventListener('dom-ready', detect);

            return () => {
                webview.removeEventListener('did-navigate', detect);
                webview.removeEventListener('dom-ready', detect);
            };
        }
    }, [currShortcut]);

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
                    </div>
                );
            })}
        </div>
    );
};

export default ShortcutContainer;