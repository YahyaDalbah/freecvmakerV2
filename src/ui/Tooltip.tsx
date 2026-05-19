import type { ReactNode } from "react";

interface TooltipProps {
    label: string;
    placement?: "top" | "bottom" | "left" | "right";
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}

const placements = {
    top: {
        popup: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        arrow: "top-full left-1/2 -translate-x-1/2 border-t-gray-900",
    },
    bottom: {
        popup: "top-full left-1/2 -translate-x-1/2 mt-2",
        arrow: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900",
    },
    left: {
        popup: "right-full top-1/2 -translate-y-1/2 mr-2",
        arrow: "left-full top-1/2 -translate-y-1/2 border-l-gray-900",
    },
    right: {
        popup: "left-full top-1/2 -translate-y-1/2 ml-2",
        arrow: "right-full top-1/2 -translate-y-1/2 border-r-gray-900",
    },
} as const;

export default function Tooltip({ label, placement = "top", children, className, disabled }: TooltipProps) {
    const { popup, arrow } = placements[placement];
    if (disabled) return <>{children}</>;
    return (
        <div className={`relative group/tooltip ${className ?? ""}`}>
            {children}
            <div className={`pointer-events-none absolute ${popup} w-max max-w-[200px] rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-50 text-center`}>
                <div className={`absolute border-4 border-transparent ${arrow}`} />
                {label}
            </div>
        </div>
    );
}
