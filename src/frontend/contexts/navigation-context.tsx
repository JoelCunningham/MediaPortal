import Shortcut from '@models/shortcut-model';
import ShortcutInstance from '@models/shortcut-instance-model';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface NavigationContextProps {
    currShortcut: ShortcutInstance | null;
    openShortcuts: ShortcutInstance[];
    addShortcut: (shortcut: Shortcut) => ShortcutInstance;
    removeShortcut: (id: string) => void;
    setCurrentShortcut: (shortcut: ShortcutInstance | null) => void;
    addAndSetCurrentShortcut: (shortcut: Shortcut) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currShortcut, setCurrShortcut] = useState<ShortcutInstance | null>(null);
    const [prevShortcuts, setPrevShortcuts] = useState<ShortcutInstance[]>([null]);
    const [openShortcuts, setOpenShortcuts] = useState<ShortcutInstance[]>([]);

    const addShortcut = (shortcut: Shortcut): ShortcutInstance => {
        const shortcutInstance = shortcut.createInstance();
        setOpenShortcuts((prev) => [...prev, shortcutInstance]);
        return shortcutInstance;
    };

    const removeShortcut = (id: string) => {
        setOpenShortcuts((prev) => prev.filter((shortcutInstance) => shortcutInstance.id !== id));
        setPrevShortcuts((prev) => prev.filter((shortcutInstance) => shortcutInstance.id !== id));
        if (currShortcut?.id === id) {
            setCurrShortcut(prevShortcuts[prevShortcuts.length - 1]);
        }
    };

    const setCurrentShortcut = (shortcutInstance: ShortcutInstance | null) => {
        setPrevShortcuts((prev) => [...prev, currShortcut]);
        setCurrShortcut(shortcutInstance);
    };

    const addAndSetCurrentShortcut = (shortcut: Shortcut) => {
        const shortcutInstance = addShortcut(shortcut);
        setCurrentShortcut(shortcutInstance);
    };

    return (
        <NavigationContext.Provider value={{ openShortcuts, currShortcut, addShortcut, removeShortcut, setCurrentShortcut, addAndSetCurrentShortcut }}>
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
