import Request from '@api/request';
import Shortcut from '@models/shortcut-model';
import { ShortcutRoute } from '@collections/enums';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ShortcutContextProps {
    shortcuts: Shortcut[];
    setShortcuts: React.Dispatch<React.SetStateAction<Shortcut[]>>;
    addShortcut: (shortcut: Shortcut) => Promise<void>;
}

const ShortcutContext = createContext<ShortcutContextProps | undefined>(undefined);

export const ShortcutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

    const addShortcut = async (shortcut: Shortcut) => {
        await Request.send(ShortcutRoute.ADD, shortcut);
        setShortcuts((prev) => [...prev, shortcut]);
    };

    useEffect(() => {
        const fetchShortcuts = async () => {
            const response = await Request.send(ShortcutRoute.GET) as Shortcut[];
            const shortcuts = response.map((s) => {
                const shortcut = Shortcut.create(s.name, s.location, s.type, s.position, s.icon);
                return shortcut;
            });
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