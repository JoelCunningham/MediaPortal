import Icon from '@components/icon';
import { useNavigationContext } from '@contexts/navigation-context';
import React, { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';

const Navbar = () => {
    const { openApps, removeApp, setCurrentApp } = useNavigationContext();

    return (
        <div className='h-screen w-screen flex flex-col'>
            <div className='flex-1 overflow-hidden'>
                <Outlet />
            </div>
            <nav className='w-full'>
                <ul className='flex'>
                    <NavbarItem icon='home' onClick={() => setCurrentApp(null)} />
                    {openApps.map((app) => (
                        <NavbarItem
                            key={app.instanceId}
                            icon={app.icon}
                            isApp
                            onClick={() => setCurrentApp(app)}
                            onClose={() => removeApp(app.instanceId)}
                        />
                    ))}
                </ul>
            </nav>
        </div>
    );
};

const NavbarItem = ({ icon, onClick, onClose, isApp }: NavbarItemProps) => {
    const [isCloseShown, setIsCloseShown] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleShow = () => {
        if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                setIsCloseShown(true);
                timeoutRef.current = null;
            }, 700);
        }
    }

    const handleHide = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsCloseShown(false);
    }

    const handleHideOnBlur = (e: React.FocusEvent) => {
        const isFocusOut = !e.currentTarget.contains(e.relatedTarget);
        if (isFocusOut) {
            handleHide();
        }
    }

    const handleClick = () => {
        (document.activeElement as HTMLElement)?.blur()
    }

    return (
        <li
            className='group text-white items-center justify-between rounded-md mt-auto'
            onMouseEnter={isApp && handleShow}
            onFocus={isApp && handleShow}
            onMouseLeave={isApp && handleHide}
            onBlur={isApp && handleHideOnBlur}
            onClick={handleClick}
        >

            <button
                onClick={onClose}
                className={`w-16 ml-4 mb-1 bg-secondary flex justify-center rounded-lg clickable focusable transitioning ${isCloseShown ? 'visible' : 'invisible'}`}
            >
                <Icon icon='close' size={30} />
            </button>

            <button
                onClick={onClick}
                className='w-16 h-16 ml-4 mb-4 bg-foreground/30 hover:bg-foreground/50 rounded-lg clickable focusable'
            >
                {isApp
                    ? <img src={icon} alt='App Icon' className='w-12 h-12 m-auto' />
                    : <Icon icon={icon} size={64} weight={500} className='text-primary' />
                }
            </button>

        </li>
    );
}

export default Navbar;

interface NavbarItemProps {
    icon: string;
    onClick: () => void;
    onClose?: () => void;
    isApp?: boolean;
}
