import React from 'react';
import clsx from 'clsx';

const Badge = ({ children, variant = 'default', className, ...props }) => {
    return (
        <span className={clsx('badge', `badge-${variant}`, className)} {...props}>
            {children}
        </span>
    );
};

export default Badge;
