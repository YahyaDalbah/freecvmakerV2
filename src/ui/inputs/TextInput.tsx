import InputLabel from "./InputLabel";

export default function TextInput({ label, name, type, placeholder, value, onChange }: { label?: string, name: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="flex flex-col gap-2">
        <InputLabel label={label} name={name} />    
        <input id={name} type={type} name={name} placeholder={placeholder} className="rounded-md p-2 bg-gray-50 border border-gray-300 outline-0" value={value} onChange={onChange} />
    </div>
  )
}
