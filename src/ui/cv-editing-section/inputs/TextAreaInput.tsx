import { memo, useState, useEffect, useCallback } from "react";
import InputLabel from "./InputLabel";
import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";
import { useAutoSave } from "../../../contexts/AutoSaveContext";

function TextAreaInput({ span = false, label, name, value = "", onChange }: { span?: boolean, label?: string, name: string, value: string | undefined, onChange: (value: string) => void }) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const { startSaving, finishSaving } = useAutoSave();

  // Sync local value when prop changes from outside
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  // Debounced onChange to parent
  useEffect(() => {
    // If local value is different, we're in "saving" state
    if (localValue !== value) {
      startSaving();
    }

    const timeoutId = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
        finishSaving();
      }
    }, 1000); // 1000ms debounce

    return () => clearTimeout(timeoutId);
  }, [localValue, onChange, value, startSaving, finishSaving]);

  const handleChange = useCallback((val: string | undefined) => {
    setLocalValue(val ?? "");
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${span ? `col-span-2` : ""}`}>
      <InputLabel label={label} name={name} />
      {/* Markdown editor with toolbar */}
      <div data-color-mode="light">
        <MDEditor
          value={localValue}
          onChange={handleChange}
          previewOptions={{ remarkPlugins: [remarkGfm] }}
          preview="edit"
          height={200}
        />
      </div>
    </div>
  );
}

export default memo(TextAreaInput);
