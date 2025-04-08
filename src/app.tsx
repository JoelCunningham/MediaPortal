import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const getApps = async (): Promise<{ id: string; name: string; location: string }[]> => {
    console.log('Fetching apps...');
    const apps = await window.Electron.ipcRenderer.invoke('get-apps');
    console.log(apps);
    return apps;
};

const App = () => {
    const [apps, setApps] = useState<{ id: string; name: string; location: string }[]>([]);

    useEffect(() => {
        const fetchApps = async () => {
            const appsData = await getApps();
            setApps(appsData);
        };
        fetchApps();
    }, []);

    return (
        <div>
            <h2>Hello from React!</h2>
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