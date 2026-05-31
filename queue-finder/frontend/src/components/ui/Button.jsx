const variants = {
  primary: 'bg-brand-orange hover:bg-brand-orange-dark text-white',
  ghost: 'border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white',
  danger: 'bg-brand-red hover:bg-brand-red-dark text-white',
  dark: 'bg-brand-black-card hover:bg-brand-black-soft text-white border border-white/10',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ variant = 'primary', size = 'md', fullWidth, onClick, disabled, children, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-semibold transition-all duration-150
        min-h-[44px] inline-flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  )
}
