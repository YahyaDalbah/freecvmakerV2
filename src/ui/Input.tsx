import { forwardRef } from 'react';

interface InputProps {
    label?: string;
    type?: 'text' | 'email' | 'password' | 'tel';
    id?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    error?: string;
    disabled?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
    label, 
    type = 'text', 
    id, 
    name, 
    placeholder, 
    value, 
    onChange,
    className,
    error,
    disabled = false
}, ref) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className={`block text-sm font-medium mb-2 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} focus:border-transparent outline-none transition ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
            />
            {error && (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

