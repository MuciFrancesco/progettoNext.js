import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = '', ...props }, ref) => {
    return (
      <div className={`login-card__field ${className}`}>
        {label && (
          <label className="input-label" htmlFor={id}>
            {label}
          </label>
        )}
        <input ref={ref} id={id} className="input" {...props} />
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
