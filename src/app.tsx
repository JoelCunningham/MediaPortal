import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const App = () => {
    const [apps, setApps] = useState<{ id: string; name: string; location: string }[]>([]);

    useEffect(() => {
        const fetchApps = async () => {
            const appsData = await window.Electron.ipcRenderer.invoke('get-apps');
            setApps(appsData);
        };
        fetchApps();
    }, []);

    return (
        <div className='bg-black'>
            <h1 className="font-bold text-2xl underline text-red-700">Hello react</h1>
            {apps.map((app) => (
                <div key={app.id}>
                    <h3>{app.name}</h3>
                    <p>{app.location}</p>
                </div>
            ))}
        </div>
    );
};

createRoot(document.body).render(
    <App />,
);