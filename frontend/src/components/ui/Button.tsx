// frontend/src/components/ui/Button.tsx
import React from 'react';
import { Loader } from 'lucide-react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant = 'primary', size = 'md', loading = false, icon, className, disabled, ...props }, ref) => {
        const baseClasses = 'btn btn-ripple';

        const variantClasses = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            outline: 'btn-outline',
            ghost: 'btn-ghost',
            danger: 'btn-danger',
        };

        const sizeClasses = {
            sm: 'btn-sm',
            md: '',
            lg: 'btn-lg',
        };

        return (
            <button
                ref={ref}
                className={clsx(
                    baseClasses,
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        {icon && icon}
                        {children}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
