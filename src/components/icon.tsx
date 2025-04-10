import React from 'react';
import 'material-symbols/rounded.css';

const Icon = ({ icon, size, className, filled, weight, grade, optical }: IconInterface) => (
    <span
        className={`material-symbols-rounded ${className}`}
        style={{ 
            fontSize: size,
            fontVariationSettings: `
                'FILL' ${filled ? '1' : '0'},
                'wght' ${weight ? weight : '400'},
                'GRAD' ${grade ? grade : '0'},
                'opsz' ${optical ? optical : '24'}
            `,

        }}    >
        {icon}
    </span>
);

export default Icon;

interface IconInterface {
    icon: string;
    size?: number;
    className?: string;
    filled?: boolean;
    weight?: number;
    grade?: number;
    optical?: number;
}
