import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="label">{label}</label>}
        <input
          ref={ref}
          className={`${error ? "input-error" : "input"} ${className}`}
          {...props}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
