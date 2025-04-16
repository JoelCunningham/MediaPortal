import { useNavigationContext } from '@contexts/navigation';
import { completeUrl } from '@services/url-service';
import React from 'react';
import { useLocation } from 'react-router-dom';

const AppContainer = () => {
    const { openApps, currentApp } = useNavigationContext();
    const location = useLocation();

    return (
        <div className="absolute inset-0 pointer-events-none">
            {openApps.map((app) => {
                const isVisible = location.pathname === '/app' && currentApp?.instanceId === app.instanceId;
                const isOnHome = location.pathname === '/home';

                return (
                    <div
                        key={app.instanceId}
                        className={`absolute inset-0 transition-opacity duration-300 ${isVisible || isOnHome ? 'opacity-100' : 'opacity-0'} ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
                        style={{ zIndex: isVisible ? 10 : 0 }}
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