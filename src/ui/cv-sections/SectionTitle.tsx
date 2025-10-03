export default function SectionTitle({ title, toGenerate }: { title: string, toGenerate?: boolean }) {
    return (
        <h2 className={`font-bold tracking-wide border-b border-black italic ${toGenerate ? "text-[17px] mb-2" : "mb-1"}`}>{title}</h2>
    )
}