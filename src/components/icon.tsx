import React from 'react';
import 'material-symbols'

const Icon = ({ icon, size, className }: IconInterface) => (
    <span
        className={`material-symbols-outlined ${className}`}
        style={{ fontSize: size }}    >
        {icon}
    </span>
);

export default Icon;

interface IconInterface {
    icon: string;
    size?: number;
    className?: string;
}