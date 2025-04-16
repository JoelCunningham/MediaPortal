import AppData from '@objects/app-data';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface NavigationContextProps {
    openApps: AppData[];
    currentApp: AppData | null;
    addApp: (app: AppData) => AppData;
    removeApp: (instanceId: number) => void;
    setCurrentApp: (app: AppData | null, skipValidation?: boolean) => void;
    addAndSetCurrentApp: (app: AppData) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nextId, setNextId] = useState(0);
    const [openApps, setOpenApps] = useState<AppData[]>([]);
    const [activeApp, setActiveApp] = useState<AppData | null>(null);

    const addApp = (app: AppData): AppData => {
        const newApp = { ...app, instanceId: nextId };
        setOpenApps((prev) => [...prev, newApp]);
        setNextId((id) => id + 1);
        return newApp;
    };

    const removeApp = (instanceId: number) => {
        setOpenApps((prev) => prev.filter((app) => app.instanceId !== instanceId));
        if (activeApp?.instanceId === instanceId) {
            setActiveApp(null);
        }
    };

    const setCurrentApp = (app: AppData | null, validate = true) => {
        const isOpen = app ? openApps.some(a => a.instanceId === app.instanceId) : false;
        if (!validate || isOpen || app === null) {
            setActiveApp(app);
        }
    };

    const addAndSetCurrentApp = (app: AppData) => {
        const newApp = addApp(app);
        setCurrentApp(newApp, false);
    };

    return (
        <NavigationContext.Provider value={{ openApps, currentApp: activeApp, addApp, removeApp, setCurrentApp, addAndSetCurrentApp }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = (): NavigationContextProps => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigationContext must be used within a NavigationProvider');
    }
    return context;
};
