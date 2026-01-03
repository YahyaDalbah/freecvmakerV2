function SolidButton({ children, onClick, color, type, fullWidth, className, shadow = true }: { children: React.ReactNode, onClick?: () => void, color: 'blue' | 'white', type?: 'button' | 'submit', fullWidth?: boolean, className?: string, shadow?: boolean }) {
  const baseClasses = "px-4 py-3 rounded-lg font-semibold cursor-pointer transition duration-200";
  const widthClasses = fullWidth ? "w-full" : "";
  
  if (color === 'blue') {
    return (
      <button 
        type={type || 'button'}
        className={`${baseClasses} ${widthClasses} bg-blue-600 text-white hover:bg-blue-700 ${shadow ? 'shadow-lg hover:shadow-xl' : ''} ${className || ''}`} 
        onClick={onClick}
      >
        {children}
      </button>
    )
  } else if (color === 'white') {
    return (
      <button 
        type={type || 'button'}
        className={`${baseClasses} ${widthClasses} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 ${className || ''}`} 
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
}

function LinkButton({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <button 
      type="button"
      className={`bg-transparent text-blue-600 hover:text-blue-700 font-semibold cursor-pointer w-fit transition ${className || ''}`} 
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default function Button({ 
  children, 
  onClick, 
  variant, 
  color = 'blue', 
  type, 
  fullWidth,
  className,
  shadow = true
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant: 'solid' | 'link', 
  color?: 'blue' | 'white', 
  type?: 'button' | 'submit',
  fullWidth?: boolean,
  className?: string,
  shadow?: boolean
}) {
    if (variant === 'solid') {
        return (
            <SolidButton onClick={onClick} color={color} type={type} fullWidth={fullWidth} className={className} shadow={shadow}>
              {children}
            </SolidButton>
        )
    } else if (variant === 'link') {
        return (
            <LinkButton onClick={onClick} className={className}>{children}</LinkButton>
        )
    }
}