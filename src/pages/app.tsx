import { useNavigationContext } from '@contexts/navigation';
import AppData from '@objects/app-data';
import { completeUrl } from '@services/url-service';
import React, { useRef } from 'react';

const WebviewContainer: React.FC<{ app: AppData; isActive: boolean }> = ({ app, isActive }) => {
    const ref = useRef<HTMLWebViewElement>(null);

    return (
        <div
            style={{
                display: isActive ? 'block' : 'none',
                width: '100%',
                height: '100%',
            }}
        >
            <webview
                ref={ref}
                src={completeUrl(app.location)}
                id={`webview-${app.instanceId}`}
                style={{ width: '100%', height: '100%' }}
                useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            />
        </div>
    );
};

const App = () => {
    const { openApps, currentApp } = useNavigationContext();

    if (!currentApp) return;

    return (
        <div className='h-screen w-screen bg-background'>
            <div className='w-full h-full'>
                {openApps.map((app) => (
                    <WebviewContainer
                        key={app.instanceId}
                        app={app}
                        isActive={currentApp.instanceId === app.instanceId}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
