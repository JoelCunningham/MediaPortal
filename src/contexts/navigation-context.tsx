import App from '@objects/app';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationContextProps {
    openApps: App[];
    currentApp?: App | null;
    addApp: (app: App) => void;
    removeApp: (instanceId: number) => void;
    setCurrentApp?: (app: App | null) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nextId, setNextId] = useState<number>(0);
    const [openApps, setOpenApps] = useState<App[]>([]);
    const [activeApp, setActiveApp] = useState<App | null>(null);
    const navigate = useNavigate();

    const addApp = (app: App) => {
        setOpenApps((prevApps) => [...prevApps, { ...app, instanceId: nextId }]);
        setNextId((prevId) => prevId + 1);
    };

    const removeApp = (instanceId: number) => {
        setOpenApps((prevApps) => prevApps.filter((app) => app.instanceId !== instanceId));
    };

    const currentApp = activeApp;

    const setCurrentApp = (app: App | null) => {
        setActiveApp(app);
        if (app) {
            navigate('/app', { state: { app } });
        } else {
            navigate('/home');
        }
    };

    return (
        <NavigationContext.Provider value={{ openApps, addApp, removeApp, setCurrentApp, currentApp }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = (): NavigationContextProps => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigationContext must be used within an NavigationProvider');
    }
    return context;
};