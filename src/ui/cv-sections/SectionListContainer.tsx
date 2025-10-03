export default function SectionListContainer({ children, toGenerate }: { children: React.ReactNode, toGenerate?: boolean }) {
    return (
        <div className={`${toGenerate ? "space-y-4" : "space-y-1"}`}>
            {children}
        </div>
    )
}