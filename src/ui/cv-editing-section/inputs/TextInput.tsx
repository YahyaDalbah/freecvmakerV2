import { memo, useState, useEffect, useCallback } from "react";
import InputLabel from "./InputLabel";

function TextInput({ label, name, type, placeholder, value, onChange }: { label?: string, name: string, type: string, placeholder: string, value: string | undefined, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [localValue, setLocalValue] = useState(value ?? "");

  // Sync local value when prop changes from outside
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  // Debounced onChange to parent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== value) {
        // Create a synthetic event for compatibility
        const syntheticEvent = {
          target: { value: localValue }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }, 150); // 150ms debounce for text inputs

    return () => clearTimeout(timeoutId);
  }, [localValue, onChange, value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <div className="flex flex-col gap-2">
        <InputLabel label={label} name={name} />    
        <input id={name} type={type} name={name} placeholder={placeholder} className="rounded-md p-2 bg-gray-50 border border-gray-300 outline-0" value={localValue} onChange={handleChange} />
    </div>
  )
}

export default memo(TextInput);
