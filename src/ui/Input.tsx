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
    error
}, ref) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} focus:border-transparent outline-none transition`}
            />
            {error && (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

