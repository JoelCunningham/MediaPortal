import React from 'react';
import 'material-symbols'

const Icon = ({ icon, size, className, onClick }: IconInterface) => (
    <span
        className={`material-symbols-outlined ${className}`}
        style={{ fontSize: size }}
        onClick={onClick}
    >
        {icon}
    </span>
);

export default Icon;

interface IconInterface {
    icon: string;
    size?: number;
    className?: string;
    onClick?: () => void;
}