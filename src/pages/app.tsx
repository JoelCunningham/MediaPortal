import { useNavigationContext } from '@contexts/navigation';
import { completeUrl } from '@services/url-service';
import React, { useEffect, useRef } from 'react';

const App = () => {
    const { currentApp } = useNavigationContext();

    const webviewRef = useRef<any>(null);

    useEffect(() => {
        if (currentApp && webviewRef.current) {
            webviewRef.current.src = completeUrl(currentApp.location);
        } 
    }, [currentApp]);

    if (!currentApp) return;

    return (
        <div className='h-screen w-screen bg-background'>
            <div className='w-full h-full flex justify-center items-center'>
                <webview
                    id='webview'
                    ref={webviewRef}
                    useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                    src={completeUrl(currentApp.location)}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
}

export default App;
