export default function ShineEffect({ children, className = '', enabled = true }) {
  if (!enabled) return <div className={className}>{children}</div>
  return (
    <div className={`shine-effect ${className}`}>
      {children}
    </div>
  )
}
