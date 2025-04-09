import App from '@objects/app';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AppsContextType {
    openApps: App[];
    addApp: (app: App) => void;
    removeApp: (instanceId: number) => void;
}

const AppsContext = createContext<AppsContextType | undefined>(undefined);

export const AppsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
        <AppsContext.Provider value={{ openApps, addApp, removeApp }}>
            {children}
        </AppsContext.Provider>
    );
};

export const useAppsContext = (): AppsContextType => {
    const context = useContext(AppsContext);
    if (!context) {
        throw new Error('useAppsContext must be used within an AppsProvider');
    }
    return context;
};