import LoadingSpinner from '../svgs/LoadingSpinner';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  color?: 'blue' | 'white';
  type?: 'button' | 'submit';
  variant?: 'solid' | 'link';
  fullWidth?: boolean;
  className?: string;
  shadow?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

function SolidButton({ children, onClick, color, type, fullWidth, className, shadow = true, disabled = false, loading = false }: ButtonProps) {
  const baseClasses = "px-4 py-3 rounded-lg font-semibold transition duration-200";
  const widthClasses = fullWidth ? "w-full" : "";
  const isDisabled = disabled || loading;
  const cursorClass = isDisabled ? "cursor-not-allowed" : "cursor-pointer";
  
  if (color === 'blue') {
    return (
      <button 
        type={type || 'button'}
        className={`${baseClasses} ${widthClasses} ${cursorClass} ${isDisabled ? 'bg-blue-400 text-white opacity-60' : 'bg-blue-600 text-white hover:bg-blue-700'} ${shadow && !isDisabled ? 'shadow-lg hover:shadow-xl' : ''} ${className || ''}`} 
        onClick={onClick}
        disabled={isDisabled}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner className="-ml-1 mr-3 h-5 w-5" color="white" />
            {children}
          </span>
        ) : children}
      </button>
    )
  } else if (color === 'white') {
    return (
      <button 
        type={type || 'button'}
        className={`${baseClasses} ${widthClasses} ${cursorClass} ${isDisabled ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'} ${className || ''}`} 
        onClick={onClick}
        disabled={isDisabled}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner className="-ml-1 mr-3 h-5 w-5" color="gray" />
            {children}
          </span>
        ) : children}
      </button>
    )
  }
}

function LinkButton({ children, onClick, className, disabled = false }: ButtonProps) {
  return (
    <button 
      type="button"
      className={`bg-transparent font-semibold w-fit transition ${disabled ? 'text-blue-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700 cursor-pointer'} ${className || ''}`} 
      onClick={onClick}
      disabled={disabled}
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
  shadow = true,
  disabled = false,
  loading = false
}: ButtonProps) {
    if (variant === 'solid') {
        return (
            <SolidButton onClick={onClick} color={color} type={type} fullWidth={fullWidth} className={className} shadow={shadow} disabled={disabled} loading={loading}>
              {children}
            </SolidButton>
        )
    } else if (variant === 'link') {
        return (
            <LinkButton onClick={onClick} className={className} disabled={disabled}>{children}</LinkButton>
        )
    }
}