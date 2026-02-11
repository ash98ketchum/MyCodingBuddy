// frontend/src/components/ui/Tooltip.tsx
import React, { useState } from 'react';
import clsx from 'clsx';

export interface TooltipProps {
    children: React.ReactElement;
    content: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    position = 'top',
    delay = 300,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        const id = setTimeout(() => setIsVisible(true), delay);
        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setIsVisible(false);
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isVisible && (
                <div
                    className={clsx(
                        'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg whitespace-nowrap animate-fade-in',
                        positionClasses[position]
                    )}
                    role="tooltip"
                >
                    {content}
                    <div
                        className={clsx(
                            'absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45',
                            {
                                'bottom-[-4px] left-1/2 -translate-x-1/2': position === 'top',
                                'top-[-4px] left-1/2 -translate-x-1/2': position === 'bottom',
                                'right-[-4px] top-1/2 -translate-y-1/2': position === 'left',
                                'left-[-4px] top-1/2 -translate-y-1/2': position === 'right',
                            }
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
