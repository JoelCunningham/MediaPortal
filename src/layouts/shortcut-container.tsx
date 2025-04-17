import { useNavigationContext } from '@contexts/navigation';
import { completeUrl } from '@services/url-service';
import React from 'react';

const ShortcutContainer = () => {
    const { openShortcuts, currShortcut } = useNavigationContext();
    const isAppActive = !!currShortcut;

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
                            src={completeUrl(shortcut.location)}
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