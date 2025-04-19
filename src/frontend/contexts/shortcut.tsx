import Request from '@api/request';
import ShortcutModel from '@models/shortcut-model';
import { ShortcutRoute } from '@objects/enums';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ShortcutContextProps {
    shortcuts: ShortcutModel[];
    setShortcuts: React.Dispatch<React.SetStateAction<ShortcutModel[]>>;
    addShortcut: (shortcut: ShortcutModel) => Promise<void>;
}

const ShortcutContext = createContext<ShortcutContextProps | undefined>(undefined);

export const ShortcutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shortcuts, setShortcuts] = useState<ShortcutModel[]>([]);

    const addShortcut = async (shortcut: ShortcutModel) => {
        await Request.send(ShortcutRoute.ADD, shortcut);
        setShortcuts((prev) => [...prev, shortcut]);
    };

    useEffect(() => {
        const fetchShortcuts = async () => {
            const response = await Request.send(ShortcutRoute.GET) as ShortcutModel[];
            const shortcuts = response.map(ShortcutModel.createFrom);
            for (const shortcut of shortcuts) {
                await shortcut.initialise();
            }
            setShortcuts(shortcuts);
        };
        fetchShortcuts()
    }, []);

    return (
        <ShortcutContext.Provider value={{ shortcuts, setShortcuts, addShortcut }}>
            {children}
        </ShortcutContext.Provider>
    );
};

export const useShortcutContext = (): ShortcutContextProps => {
    const context = useContext(ShortcutContext);
    if (!context) {
        throw new Error('useShortcutContext must be used within a ShortcutProvider');
    }
    return context;
};