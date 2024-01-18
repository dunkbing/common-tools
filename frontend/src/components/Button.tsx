import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type, children, ...props }, ref) => {
    return (
      <button
        type={type}
        className={`
          rounded-md border border-input
          bg-zinc-500 px-2 py-1
          hover:bg-zinc-600
          text-white text-sm shadow-sm
          transition-colors file:border-0
          file:bg-transparent file:text-sm
          file:font-medium placeholder:text-muted-foreground
          focus-visible:outline-none
          focus-visible:ring-1
          focus-visible:ring-ring
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Input';

export default Button;
