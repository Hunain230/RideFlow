import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  wrapperClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, type = 'text', wrapperClassName, className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={clsx('form-field', wrapperClassName)}>
        {isPassword ? (
          <div className="password-wrapper">
            <input
              ref={ref}
              id={inputId}
              type={inputType}
              className={clsx('form-input-dark', error && 'error', className)}
              placeholder=" "
              {...props}
            />
            <label htmlFor={inputId}>{label}</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        ) : (
          <>
            <input
              ref={ref}
              id={inputId}
              type={inputType}
              className={clsx('form-input-dark', error && 'error', className)}
              placeholder=" "
              {...props}
            />
            <label htmlFor={inputId}>{label}</label>
          </>
        )}
        {error && (
          <p className="form-error-msg" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';
