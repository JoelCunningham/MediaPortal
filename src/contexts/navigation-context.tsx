import App from '@objects/app';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface NavigationContextProps {
    openApps: App[];
    addApp: (app: App) => void;
    removeApp: (instanceId: number) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nextId, setNextId] = useState<number>(0);
    const [openApps, setOpenApps] = useState<App[]>([]);

    const addApp = (app: App) => {
        setOpenApps((prevApps) => [...prevApps, { ...app, instanceId: nextId }]);
        setNextId((prevId) => prevId + 1);
    };

    const removeApp = (instanceId: number) => {
        setOpenApps((prevApps) => prevApps.filter((app) => app.instanceId !== instanceId));
    };

    return (
        <NavigationContext.Provider value={{ openApps, addApp, removeApp }}>
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