import React from 'react';
import clsx from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'easy' | 'medium' | 'hard' | 'tag' | 'custom';
    icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ children, variant = 'custom', icon, className, ...props }, ref) => {
        const variantClasses = {
            easy: 'badge-easy',
            medium: 'badge-medium',
            hard: 'badge-hard',
            tag: 'badge-tag',
            custom: '',
        };

        return (
            <span
                ref={ref}
                className={clsx(
                    'badge',
                    variantClasses[variant],
                    className
                )}
                {...props}
            >
                {icon && icon}
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

export default Badge;
