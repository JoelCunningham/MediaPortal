import React, { createContext, ReactNode, useContext, useState } from 'react';
import Shortcut from '../models/shortcut-model';

interface NavigationContextProps {
    currShortcut: Shortcut | null;
    openShortcuts: Shortcut[];
    addShortcut: (shortcut: Shortcut) => Shortcut;
    removeShortcut: (instance: string) => void;
    setCurrentShortcut: (shortcut: Shortcut | null, validate?: boolean) => void;
    addAndSetCurrentShortcut: (shortcut: Shortcut) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currShortcut, setCurrShortcut] = useState<Shortcut | null>(null);
    const [prevShortcuts, setPrevShortcuts] = useState<Shortcut[]>([null]);
    const [openShortcuts, setOpenShortcuts] = useState<Shortcut[]>([]);

    const addShortcut = (shortcut: Shortcut): Shortcut => {
        const newShortcut = shortcut.createInstance();
        setOpenShortcuts((prev) => [...prev, newShortcut]);
        return newShortcut;
    };

    const removeShortcut = (instance: string) => {
        setOpenShortcuts((prev) => prev.filter((shortcut) => shortcut.instance !== instance));
        setPrevShortcuts((prev) => prev.filter((shortcut) => shortcut.instance !== instance));
        if (currShortcut?.instance === instance) {
            setCurrShortcut(prevShortcuts[prevShortcuts.length - 1]);
        }
    };

    const setCurrentShortcut = (shortcut: Shortcut | null, validate = true) => {
        const isOpen = shortcut ? openShortcuts.some(s => s.instance === shortcut.instance) : false;
        if (!validate || isOpen || shortcut === null) {
            setPrevShortcuts((prev) => [...prev, currShortcut]);
            setCurrShortcut(shortcut);
        }
    };

    const addAndSetCurrentShortcut = (shortcut: Shortcut) => {
        const newShortcut = addShortcut(shortcut);
        setCurrentShortcut(newShortcut, false);
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
