export type TabOption<T extends string = string> = {
    value: T;
    label: string;
};

type TabsProps<T extends string> = {
    value: T;
    onChange: (value: T) => void;
    tabs: TabOption<T>[];
    "aria-label"?: string;
    className?: string;
};

export default function Tabs<T extends string>({
    value,
    onChange,
    tabs,
    "aria-label": ariaLabel,
    className = "",
}: TabsProps<T>) {
    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className={`inline-flex rounded-lg bg-gray-200 p-1 ${className}`.trim()}
        >
            {tabs.map((tab) => {
                const selected = value === tab.value;
                return (
                    <button
                        key={tab.value}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onChange(tab.value)}
                        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                            selected
                                ? "bg-white text-black shadow-sm"
                                : "bg-transparent text-gray-700 hover:bg-gray-300 hover:text-black"
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
