import { faChevronDown, faChevronUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function DropdownMenu({ children, onDelete, title }: { children: React.ReactNode, onDelete: () => void, title: string | undefined }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    function handleDelete(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation();
        onDelete();
    }

    return (
        <div
            className="border border-gray-300 rounded-md px-4 py-8"
        >
            <div className="flex justify-between items-center cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={toggleDropdown}>
                <h3 className={`${isHovered ? 'text-blue-400' : 'text-gray-700'}`}>{title || '(Untitled)'}</h3>
                <div className="flex items-center gap-4">
                    <FontAwesomeIcon onClick={(e) => handleDelete(e)} onMouseEnter={() => setIsHovered(false)} onMouseLeave={() => setIsHovered(true)} className="text-gray-400 hover:text-red-500 cursor-pointer" icon={faTrash} />
                    <FontAwesomeIcon className={`${isHovered ? 'text-blue-400' : 'text-gray-400'} cursor-pointer`} icon={isOpen ? faChevronUp : faChevronDown} />
                </div>
            </div>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                <div className="pt-4">
                    {children}
                </div>
            </div>
        </div>
    )
}
