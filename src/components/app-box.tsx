import AppData from '@objects/app-data';
import { getIcon } from '@services/app-service';
import React, { useEffect, useState } from 'react';
import { useNavigationContext } from '@contexts/navigation';

const AppBox = ({ app }: AppBoxProps) => {
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const { addAndSetCurrentApp } = useNavigationContext();

    useEffect(() => {
        getIcon(app.location, app.isWeb).then((icon) => { setIconUrl(icon); })
    }, [app.location, app.isWeb]);

    const handleClick = () => {
        if (app.isWeb) {
            addAndSetCurrentApp(app);
        } else {
            window.Electron.ipcRenderer.invoke('launch-app', app).catch((error) => {
                console.error('Error opening URL:', error);
            });
        };
    }

    return (
        <button
            className='p-4 rounded-lg w-40 items-center justify-center m-4 hover:bg-foreground clickable focusable transitioning'
            onClick={handleClick}
        >
            <img src={iconUrl} alt={app.name} className='w-16 h-16 m-auto' />
            <h1 className='text-xl mb-4'>{app.name}</h1>
        </button>
    );
};

export default AppBox;


interface AppBoxProps {
    app: AppData;
}