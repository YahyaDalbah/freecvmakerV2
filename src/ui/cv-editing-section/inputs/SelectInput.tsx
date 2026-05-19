import { memo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import InputLabel from "./InputLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";

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

    const current = value ?? Math.ceil((min + max) / 2);
    const [open, setOpen] = useState(false);
    const [listPos, setListPos] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const updatePos = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setListPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
        }
    };

    useEffect(() => {
        if (!open) return;
        const onMouseDown = (e: MouseEvent) => {
            if (
                buttonRef.current?.contains(e.target as Node) ||
                listRef.current?.contains(e.target as Node)
            ) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", onMouseDown);
        window.addEventListener("scroll", updatePos, { capture: true, passive: true });
        window.addEventListener("resize", updatePos, { passive: true });
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("scroll", updatePos, { capture: true });
            window.removeEventListener("resize", updatePos);
        };
    }, [open]);

    const handleOpen = () => {
        if (!open) updatePos();
        setOpen(o => !o);
    };

    return (
        <div className="flex flex-col gap-2">
            <InputLabel label={label} />
            <button
                ref={buttonRef}
                type="button"
                id={name}
                onClick={handleOpen}
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg bg-white text-left text-gray-800 cursor-pointer transition ${
                    open
                        ? "border-transparent ring-2 ring-inset ring-blue-500"
                        : "border-gray-300 hover:border-gray-400"
                }`}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="text-sm">{current}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-gray-400 text-xs transition-transform duration-200 ${open ? "-rotate-180" : ""}`}
                />
            </button>

            {open && createPortal(
                <ul
                    ref={listRef}
                    role="listbox"
                    aria-label={label}
                    style={{ top: listPos.top, left: listPos.left, width: listPos.width }}
                    className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 overflow-auto max-h-48"
                >
                    {options.map((opt) => {
                        const selected = opt === current;
                        return (
                            <li
                                key={opt}
                                role="option"
                                aria-selected={selected}
                                onMouseDown={() => { onChange(opt); setOpen(false); }}
                                className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm transition-colors ${
                                    selected
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {opt}
                                {selected && (
                                    <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-xs" />
                                )}
                            </li>
                        );
                    })}
                </ul>,
                document.body
            )}
        </div>
    );
}

export default memo(SelectInput);
