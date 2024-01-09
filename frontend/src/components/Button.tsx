import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type, children, icon, ...props }, ref) => {
    return (
      <button
        type={type}
        className={`
          rounded-md border border-input
          bg-slate-500 bg-transparent px-2 py-1
          text-white text-sm shadow-sm
          hover:bg-slate-600
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
