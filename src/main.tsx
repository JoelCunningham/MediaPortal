import AddAppModal from '@components/add-app-modal';
import AppBox from '@components/app-box';
import { AddButton } from '@components/inputs';
import Navbar from '@components/navbar';
import { AppsProvider } from '@contexts/apps-context';
import App from '@objects/app';
import { completeUrl } from '@services/url-service';

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const Main = () => {
    const [apps, setApps] = useState<App[]>([]);
    const [isModalOpen, setIsOpen] = useState(false);

    const [currentApp, setCurrentApp] = useState<App>(new App());
    const webviewRef = React.useRef<any>(null);

    useEffect(() => {
        const fetchApps = async () => {
            const appsData = await window.Electron.ipcRenderer.invoke('get-apps');
            setApps(appsData);
            setCurrentApp(appsData[1]);
        };
        fetchApps();
    }, []);

    useEffect(() => {
        if (webviewRef.current) {
            webviewRef.current.src = completeUrl(currentApp.location);
        }
    }, [currentApp]);

    return (
        <div className='bg-background h-screen w-screen'>
            <div className="absolute top-4 w-full flex justify-center">
                <h1 className="text-2xl text-white">Apps</h1>
                <Navbar />
            </div>
            <div className='text-white h-full flex items-center justify-center'>
                {apps.map((app) => (
                    <AppBox key={app.id} app={app} />
                ))}
                {/* <webview
                    id="webview"
                    ref={webviewRef}
                    useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
                    src={completeUrl(currentApp.location)}
                    style={{ width: '100%', height: '100%' }}
                /> */}
            </div>
            <div className="absolute bottom-4 w-full flex justify-center">
                <AddButton onClick={() => setIsOpen(true)} />
            </div>
            <AddAppModal isOpen={isModalOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

createRoot(document.body).render(
    <AppsProvider>
        <Main />,
    </AppsProvider>
);