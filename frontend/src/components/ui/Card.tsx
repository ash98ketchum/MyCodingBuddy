import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'hover' | 'glass' | 'clickable';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, variant = 'default', padding = 'md', className, ...props }, ref) => {
        const variantClasses = {
            default: 'card',
            hover: 'card-hover',
            glass: 'card-glass',
            clickable: 'card-clickable',
        };

        const paddingClasses = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        };

        return (
            <div
                ref={ref}
                className={clsx(
                    variantClasses[variant],
                    paddingClasses[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
