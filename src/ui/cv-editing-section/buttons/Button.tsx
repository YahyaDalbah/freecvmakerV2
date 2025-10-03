function SolidButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={onClick}>{children}</button>
  )
}
function LinkButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <button className="bg-transparent text-blue-500 cursor-pointer w-fit hover:text-blue-700" onClick={onClick}>{children}</button>
  )
}

export default function Button({ children, onClick, variant }: { children: React.ReactNode, onClick: () => void, variant: 'solid' | 'link' }) {
    if (variant === 'solid') {
        return (
            <SolidButton onClick={onClick}>{children}</SolidButton>
        )
    } else if (variant === 'link') {
        return (
            <LinkButton onClick={onClick}>{children}</LinkButton>
        )
    }
}