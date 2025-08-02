export default function GridInputsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {children}
    </div>
  )
}
