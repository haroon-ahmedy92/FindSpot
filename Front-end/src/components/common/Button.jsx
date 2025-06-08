import React from 'react';

const Button = ({ variant = 'primary', children, className = '', icon, ...props }) => {
    const baseStyles = 'py-2 px-4 rounded-lg font-medium flex items-center justify-center animate-scale transition';
    const variantStyles = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        accent: 'btn-accent',
        outlinePrimary: 'btn-outline-primary',
        outlineSecondary: 'btn-outline-secondary',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant] || ''} ${className}`}
            {...props}
        >
            {icon && <i className={`fas ${icon} ${children ? 'mr-2' : ''}`}></i>}
            {children}
        </button>
    );
};

export default Button;