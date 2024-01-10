import { forwardRef } from 'react';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: React.ReactNode;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none bg-slate-700 ${className}`}
      />
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
