import AddAppModal from '@components/add-app-modal';
import AppBox from '@components/app-box';
import { AddButton } from '@components/inputs';
import AppData from '@objects/app-data';
import { loadIcons } from '@services/app-service';
import React, { useEffect, useState } from 'react';

const Home = () => {
    const [apps, setApps] = useState<AppData[]>([]);
    const [isModalOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchApps = async () => {
            const response = await window.Electron.ipcRenderer.invoke('get-apps');
            const prepared = await loadIcons(response);
            setApps(prepared);
        };
        fetchApps();
    }, []);

    return (
        <div className='h-full'>

            <div className='h-full flex flex-col items-center justify-center text-white'>
                <div className='flex justify-center gap-4 '>
                    {apps.map((app) => (
                        <AppBox key={app.id} app={app} />
                    ))}
                </div>
                <div className='mt-4'>
                    <AddButton onClick={() => setIsOpen(true)} />
                </div>
            </div>

            <AddAppModal isOpen={isModalOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}

export default Home;