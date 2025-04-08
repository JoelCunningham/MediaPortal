import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AddAppModal from './components/add-app-modal';
import { AddButton } from './components/inputs';

const App = () => {
    const [apps, setApps] = useState<{ id: string; name: string; location: string }[]>([]);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            const appsData = await window.Electron.ipcRenderer.invoke('get-apps');
            setApps(appsData);
        };
        fetchApps();
    }, []);

    return (
        <div className='bg-background h-screen w-screen'>
            <h1 className="text-2xl text-primary">Hello react</h1>
            {apps.map((app) => (
                <div key={app.id}>
                    <h3>{app.name}</h3>
                    <p>{app.location}</p>
                </div>
            ))}
            <div className="absolute bottom-4 w-full flex justify-center">
                <AddButton onClick={() => setIsOpen(true)} />
            </div>
            <AddAppModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

createRoot(document.body).render(
    <App />,
);