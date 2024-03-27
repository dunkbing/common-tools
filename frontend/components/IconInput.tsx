import React, { forwardRef } from "react";
import { Input } from "./ui/input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const IconInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return icon ? (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          {icon}
        </div>
        <Input type={type} className={className} ref={ref} {...props} />
      </div>
    ) : (
      <Input type={type} className={className} ref={ref} {...props} />
    );
  }
);

IconInput.displayName = "IconInput";

export default IconInput;
