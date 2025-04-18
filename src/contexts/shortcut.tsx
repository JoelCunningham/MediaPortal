import ShortcutModel from '@models/shortcut-model';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ShortcutContextProps {
    shortcuts: ShortcutModel[];
    setShortcuts: React.Dispatch<React.SetStateAction<ShortcutModel[]>>;
    addShortcut: (shortcut: ShortcutModel) => void;
}

const ShortcutContext = createContext<ShortcutContextProps | undefined>(undefined);

export const ShortcutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shortcuts, setShortcuts] = useState<ShortcutModel[]>([]);

    const addShortcut = async (shortcut: ShortcutModel) => {
        await window.Electron.ipcRenderer.invoke('add-shortcut', shortcut);
        setShortcuts((prev) => [...prev, shortcut]);
    };

    useEffect(() => {
        const fetchShortcuts = async () => {
            const shortcuts = await window.Electron.ipcRenderer.invoke('get-shortcuts');
            for (const shortcut of shortcuts) {
                shortcut.initialise();
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