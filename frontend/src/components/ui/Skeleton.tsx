// frontend/src/components/ui/Skeleton.tsx
import React from 'react';
import clsx from 'clsx';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    shimmer = false,
    className,
    ...props
}) => {
    const baseClasses = shimmer ? 'skeleton-shimmer rounded' : 'skeleton';

    const variantClasses = {
        text: 'h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const style: React.CSSProperties = {
        width: width,
        height: height || (variant === 'text' ? '1rem' : '100%'),
    };

    return (
        <div
            className={clsx(
                baseClasses,
                variantClasses[variant],
                className
            )}
            style={style}
            {...props}
        />
    );
};

// Additional skeleton component for common patterns
export const SkeletonCard: React.FC = () => (
    <div className="card p-6 space-y-4">
        <Skeleton width="75%" height="1.5rem" />
        <Skeleton width="100%" />
        <Skeleton width="90%" />
        <div className="flex gap-2 mt-4">
            <Skeleton variant="circular" width="2rem" height="2rem" />
            <Skeleton variant="circular" width="2rem" height="2rem" />
            <Skeleton variant="circular" width="2rem" height="2rem" />
        </div>
    </div>
);

export default Skeleton;
