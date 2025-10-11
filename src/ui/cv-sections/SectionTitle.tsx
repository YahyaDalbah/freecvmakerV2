export default function SectionTitle({ title }: { title: string }) {
    return (
        title ? <h2 className={"font-bold tracking-wide border-b border-black italic text-[17px] mb-2"}>{title}</h2> : <></>
    )
}