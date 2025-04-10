import { useNavigationContext } from '@contexts/navigation-context';
import React from 'react';
import Icon from './icon';

const Navbar = () => {
    const { openApps, removeApp } = useNavigationContext();

    return (
        <nav className="w-full">
            <ul className="flex gap-4">
                <NavbarItem icon="home" onClick={() => console.log('Home clicked')} onClose={() => console.log('Home closed')} />
                {openApps.map((app) => (
                    <NavbarItem
                        key={app.instanceId}
                        icon={app.icon}
                        isApp
                        onClick={() => console.log(`App ${app.name} clicked`)}
                        onClose={() => removeApp(app.instanceId)}
                    />
                ))}
            </ul>
        </nav>
    );
}

const NavbarItem = ({ icon, onClick, onClose, isApp }: NavbarItemProps) => {
    const [isCloseShown, setIsCloseShown] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleShow = () => {
        timeoutRef.current = setTimeout(() => {
            setIsCloseShown(true);
        }, 500);
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

    return (
        <li
            className="group text-white items-center justify-between rounded-md"
            onMouseEnter={isApp && handleShow}
            onFocus={isApp && handleShow}
            onMouseLeave={isApp && handleHide}
            onBlur={isApp && handleHideOnBlur}
        >
            <button
                onClick={onClick}
                className="h-16 w-16 bg-background hover:bg-foreground rounded-lg clickable focusable"
            >
                {isApp
                    ? <img src={icon} alt="App Icon" className="w-12 h-12 m-auto" />
                    : <Icon icon={icon} size={64} />
                }
            </button>
            {isCloseShown && (
                <div className='pt-1'>
                    <button
                        className={`bg-secondary w-full flex justify-center rounded-lg clickable focusable transitioning`}
                        onClick={onClose}
                    >
                        <Icon icon="close" size={30} />
                    </button>
                </div>
            )}
        </li>
    );
}


export default Navbar;

interface NavbarItemProps {
    icon: string;
    onClick: () => void;
    onClose: () => void;
    isApp?: boolean;
}