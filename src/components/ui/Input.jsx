import React from 'react';
import clsx from 'clsx';

const Input = ({ className, ...props }) => {
    return (
        <input
            className={clsx('input', className)}
            {...props}
        />
    );
};

export default Input;
