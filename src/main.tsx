import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AddAppModal from './components/add-app-modal';
import { AddButton } from './components/inputs';
import AppBox from './components/app-box';
import App from './types/app';

const Main = () => {
    const [apps, setApps] = useState<App[]>([]);
    const [isModalOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchApps = async () => {
            const appsData = await window.Electron.ipcRenderer.invoke('get-apps');
            setApps(appsData);
        };
        fetchApps();
    }, []);

    return (
        <div className='bg-background h-screen w-screen'>
            <h1 className="text-2xl text-white">Apps</h1>
            <div className='text-white flex'>
                {apps.map((app) => (
                    <AppBox key={app.id} app={app} />
                ))}
            </div>
            <div className="absolute bottom-4 w-full flex justify-center">
                <AddButton onClick={() => setIsOpen(true)} />
            </div>
            <AddAppModal isOpen={isModalOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

createRoot(document.body).render(
    <Main />,
);