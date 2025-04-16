import { useNavigationContext } from '@contexts/navigation';
import { completeUrl } from '@services/url-service';
import React from 'react';

const AppContainer = () => {
    const { openApps, currentApp } = useNavigationContext();
    const isAppActive = !!currentApp;

    return (
        <div className={`h-full ${!isAppActive && 'hidden'}`}>
            {openApps.map((app) => {
                const isShown = currentApp?.instanceId === app.instanceId;

                return (
                    <div
                        key={app.instanceId}
                        className={`h-full ${!isShown && 'hidden'}`}
                    >
                        <webview
                            src={completeUrl(app.location)}
                            useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default AppContainer;