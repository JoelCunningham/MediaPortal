import { useNavigationContext } from '@contexts/navigation';
import Shortcut from '@models/shortcut-model';
import { ShortcutType } from '@objects/enums';
import React from 'react';

const ShortcutBox = ({ shortcut }: ShortcutBoxProps) => {
    const { addAndSetCurrentShortcut } = useNavigationContext();

    const handleClick = () => {
        if (shortcut.type === ShortcutType.WEB) {
            addAndSetCurrentShortcut(shortcut);
        } else {
            window.Electron.ipcRenderer.invoke('launch-shortcut', shortcut).catch((error) => {
                console.error('Error opening URL:', error);
            });
        };
    }

    return (
        <button
            className='p-4 rounded-lg w-40 items-center justify-center m-4 hover:bg-foreground clickable focusable transitioning'
            onClick={handleClick}
        >
            <img src={shortcut.icon} alt={shortcut.name} className='w-16 h-16 m-auto' />
            <h1 className='text-xl mb-4'>{shortcut.name}</h1>
        </button>
    );
};

export default ShortcutBox;

interface ShortcutBoxProps {
    shortcut: Shortcut;
}