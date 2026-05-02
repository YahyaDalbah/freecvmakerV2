import { memo } from "react";
import InputLabel from "./InputLabel";

interface SelectInputProps {
    label?: string;
    name: string;
    value: number | undefined;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

function SelectInput({ label, name, value, onChange, min = 1, max = 5 }: SelectInputProps) {
    const options: number[] = [];
    for (let i = min; i <= max; i++) options.push(i);

    return (
        <div className="flex flex-col gap-2">
            <InputLabel label={label} />
            <select
                id={name}
                name={name}
                value={value ?? Math.ceil((min + max) / 2)}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-inset focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default memo(SelectInput);
