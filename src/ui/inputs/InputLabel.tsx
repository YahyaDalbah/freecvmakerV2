export default function InputLabel({ label, name }: { label?: string, name: string }) {
    return (
        <>
            {label && <label htmlFor={name} className="text-sm font-medium text-gray-400">{label}</label>}
        </>
    )
}
