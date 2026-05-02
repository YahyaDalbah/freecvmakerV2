import LoadingSpinner from "../svgs/LoadingSpinner";

export type ButtonSolidColor = "blue" | "white" | "emerald";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void | Promise<void>;
    color?: ButtonSolidColor;
    type?: "button" | "submit";
    variant?: "solid" | "ghost";
    fullWidth?: boolean;
    className?: string;
    shadow?: boolean;
    disabled?: boolean;
    loading?: boolean;
};

const SOLID_PALETTE: Record<
    ButtonSolidColor,
    { rest: string; disabled: string; spinner: "white" | "gray" }
> = {
    blue: {
        rest: "bg-blue-600 text-white hover:bg-blue-700",
        disabled: "bg-blue-400 text-white opacity-60",
        spinner: "white",
    },
    white: {
        rest: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
        disabled: "bg-gray-100 text-gray-400 border border-gray-200 opacity-60",
        spinner: "gray",
    },
    emerald: {
        rest: "bg-emerald-600 text-white hover:bg-emerald-700",
        disabled: "bg-emerald-400 text-white opacity-60",
        spinner: "white",
    },
};

function SolidButton({
    children,
    onClick,
    color = "blue",
    type,
    fullWidth,
    className,
    shadow = true,
    disabled = false,
    loading = false,
}: ButtonProps) {
    const baseClasses = "px-4 py-3 rounded-lg font-semibold transition duration-200";
    const widthClasses = fullWidth ? "w-full" : "";
    const isDisabled = disabled || loading;
    const cursorClass = isDisabled ? "cursor-not-allowed" : "cursor-pointer";
    const palette = SOLID_PALETTE[color];
    const toneClasses = isDisabled ? palette.disabled : palette.rest;
    const shadowClasses =
        shadow && !isDisabled ? "shadow-lg hover:shadow-xl" : "";

    return (
        <button
            type={type || "button"}
            className={`${baseClasses} ${widthClasses} ${cursorClass} ${toneClasses} ${shadowClasses} ${className || ""}`}
            onClick={() => void onClick?.()}
            disabled={isDisabled}
        >
            {loading ? (
                <span className="flex items-center justify-center">
                    <LoadingSpinner className="-ml-1 mr-3 h-5 w-5" color={palette.spinner} />
                    {children}
                </span>
            ) : (
                children
            )}
        </button>
    );
}

function GhostButton({ children, onClick, className, disabled = false }: ButtonProps) {
    return (
        <button
            type="button"
            className={`w-fit rounded-lg bg-transparent px-3 py-2 font-semibold transition-all duration-200 ${
                disabled ? "cursor-not-allowed text-blue-300" : "cursor-pointer text-blue-600 hover:bg-gray-200"
            } ${className || ""}`}
            onClick={() => void onClick?.()}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default function Button({
    children,
    onClick,
    variant = "solid",
    color = "blue",
    type,
    fullWidth,
    className,
    shadow = true,
    disabled = false,
    loading = false,
}: ButtonProps) {
    if (variant === "solid") {
        return (
            <SolidButton
                onClick={onClick}
                color={color}
                type={type}
                fullWidth={fullWidth}
                className={className}
                shadow={shadow}
                disabled={disabled}
                loading={loading}
            >
                {children}
            </SolidButton>
        );
    }
    return (
        <GhostButton onClick={onClick} className={className} disabled={disabled}>
            {children}
        </GhostButton>
    );
}
