import AddAppModal from '@components/add-app-modal';
import AppBox from '@components/app-box';
import { AddButton } from '@components/inputs';
import Navbar from '@components/navbar';
import { NavigationProvider } from '@contexts/navigation-context';
import App from '@objects/app';
import { completeUrl } from '@services/url-service';

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { loadIcons } from '@services/app-service';

const Main = () => {
    const [apps, setApps] = useState<App[]>([]);
    const [isModalOpen, setIsOpen] = useState(false);

    const [currentApp, setCurrentApp] = useState<App>(new App());
    const webviewRef = React.useRef<any>(null);

    useEffect(() => {
        const fetchApps = async () => {
            const response = await window.Electron.ipcRenderer.invoke('get-apps');
            const prepared = await loadIcons(response);
            setApps(prepared);
        };
        fetchApps();
    }, []);

    useEffect(() => {
        if (webviewRef.current) {
            webviewRef.current.src = completeUrl(currentApp.location);
        }
    }, [currentApp]);

    return (
        <div className='h-screen w-screen bg-background grid grid-rows-[1fr_auto]'>

            <div className="w-full flex flex-col items-center justify-center text-white">
                <div className="w-full flex justify-center gap-4 ">
                    {apps.map((app) => (
                        <AppBox key={app.id} app={app} />
                    ))}
                    {/* <webview
                    id='webview'
                    ref={webviewRef}
                    useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                    src={completeUrl(currentApp.location)}
                    style={{ width: '100%', height: '100%' }}
                    /> */}
                </div>
                <div className="mt-4">
                    <AddButton onClick={() => setIsOpen(true)} />
                </div>
            </div>

            <Navbar />

            <AddAppModal isOpen={isModalOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

createRoot(document.body).render(
    <NavigationProvider>
        <Main />
    </NavigationProvider>
);