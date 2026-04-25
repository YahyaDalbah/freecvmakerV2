import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { CV_TEMPLATE_META } from "./cvTemplates";

interface TemplatesProps {
    selectedTemplateId: string;
    onSelect: (id: string) => void;
}

export default function Templates({ selectedTemplateId, onSelect }: TemplatesProps) {
    return (
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
                        <img
                            src={tpl.image}
                            alt={tpl.label}
                            className="w-full object-cover"
                            draggable={false}
                        />
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
    );
}
