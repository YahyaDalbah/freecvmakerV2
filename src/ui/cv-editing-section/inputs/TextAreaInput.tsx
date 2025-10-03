import InputLabel from "./InputLabel";
import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";

export default function TextAreaInput({ span = false, label, name, value = "", onChange }: { span?: boolean, label?: string, name: string, value: string | undefined, onChange: (value: string) => void }) {
  return (
    <div className={`flex flex-col gap-2 ${span ? `col-span-2` : ""}`}>
      <InputLabel label={label} name={name} />
      {/* Markdown editor with toolbar */}
      <div data-color-mode="light">
        <MDEditor
          value={value ?? ""}
          onChange={(val) => onChange(val ?? "")}
          previewOptions={{ remarkPlugins: [remarkGfm] }}
        />
      </div>
    </div>
  );
}
