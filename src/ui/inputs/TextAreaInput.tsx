import InputLabel from "./InputLabel";

export default function TextAreaInput({ span = false, label, name, placeholder, value, onChange }: { span?: boolean, label?: string, name: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div className={`flex flex-col gap-2 ${span ? `col-span-2` : ''}`}>
            <InputLabel label={label} name={name} />
            <textarea id={name} name={name} placeholder={placeholder} className={`rounded-md p-2 bg-gray-50 border border-gray-300 outline-0`} value={value} onChange={onChange} />
        </div>
    )
}
