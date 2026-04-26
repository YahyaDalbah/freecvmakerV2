import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { CV_TEMPLATE_META } from "./cvTemplates";

export const COLOR_PRESETS = [
    "#1f0a14",
    "#0d5d5a",
    "#b5451b",
    "#1a3066",
    "#2d1a50",
];

interface TemplatesProps {
    selectedTemplateId: string;
    onSelect: (id: string) => void;
    selectedColor: string;
    onColorChange: (color: string) => void;
}

export default function Templates({ selectedTemplateId, onSelect, selectedColor, onColorChange }: TemplatesProps) {
    const isPreset = COLOR_PRESETS.includes(selectedColor);

    return (
        <div className="flex flex-col gap-6">
            {/* Color picker */}
            <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Main color</p>
                <div className="flex flex-wrap items-center gap-2">
                    {COLOR_PRESETS.map((color) => {
                        const active = selectedColor === color;
                        return (
                            <button
                                key={color}
                                type="button"
                                onClick={() => onColorChange(color)}
                                title={color}
                                style={{ backgroundColor: color }}
                                className={`h-8 w-8 rounded-full border-2 transition focus:outline-none ${
                                    active
                                        ? "border-blue-500 ring-2 ring-blue-500"
                                        : "border-transparent hover:border-gray-400"
                                }`}
                                aria-label={`Select color ${color}`}
                                aria-pressed={active}
                            >
                                {active && (
                                    <FontAwesomeIcon icon={faCheck} className="text-white drop-shadow text-xs" />
                                )}
                            </button>
                        );
                    })}

                    {/* Custom color */}
                    <label
                        title="Custom color"
                        className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition focus-within:ring-2 focus-within:ring-blue-500 ${
                            !isPreset
                                ? "border-blue-500 ring-2 ring-blue-500"
                                : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{
                            background:
                                "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                        }}
                        aria-label="Custom color"
                    >
                        {!isPreset ? (
                            <div
                                className="h-5 w-5 rounded-full border border-white/50"
                                style={{ backgroundColor: selectedColor }}
                            />
                        ) : (
                            <span className="text-xs font-bold text-white drop-shadow select-none">+</span>
                        )}
                        <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => onColorChange(e.target.value)}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            aria-label="Pick a custom color"
                        />
                    </label>
                </div>
            </div>

            {/* Template grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {CV_TEMPLATE_META.map((tpl) => {
                    const isSelected = tpl.id === selectedTemplateId;
                    return (
                        <button
                            key={tpl.id}
                            type="button"
                            onClick={() => onSelect(tpl.id)}
                            className={`relative overflow-hidden rounded-lg border-2 transition focus:outline-none ${
                                isSelected
                                    ? "border-blue-500 ring-2 ring-blue-500"
                                    : "border-gray-200 hover:border-blue-400 hover:ring-2 hover:ring-blue-400"
                            }`}
                            aria-label={`Select template: ${tpl.label}`}
                            aria-pressed={isSelected}
                        >
                            <div className="aspect-[210/297] w-full overflow-hidden">
                                <img
                                    src={tpl.image}
                                    alt={tpl.label}
                                    className="h-full w-full object-cover object-top"
                                    draggable={false}
                                />
                            </div>
                            {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                                        <FontAwesomeIcon icon={faCheck} size="lg" />
                                    </div>
                                </div>
                            )}
                            <div className="bg-white px-2 py-1 text-center text-sm font-medium text-gray-700">
                                {tpl.label}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
