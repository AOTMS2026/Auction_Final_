import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className, showStrength, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    // Convert value to string for length checking safely
    const passwordValue = (value as string) || "";

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    // Very basic strength calculation for UI purposes
    const calculateStrength = (pass: string) => {
      let strength = 0;
      if (pass.length >= 8) strength += 1;
      if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 1;
      if (/\d/.test(pass)) strength += 1;
      if (/[^a-zA-Z\d]/.test(pass)) strength += 1;
      return Math.min(strength, 3);
    };

    const strength = showStrength ? calculateStrength(passwordValue) : 0;

    return (
      <div className="space-y-2 w-full">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn(
              "pr-10 bg-[#18200e]/80 border-[#4c562c]/60 text-[#fefae0] placeholder:text-[#a9b876]/50 focus-visible:ring-[#dda15e] focus-visible:border-[#dda15e]",
              className
            )}
            ref={ref}
            value={value}
            onChange={onChange}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent flex items-center justify-center text-[#a9b876] hover:text-[#fefae0] transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        
        {showStrength && passwordValue.length > 0 && (
          <div className="flex gap-1.5 h-1.5 w-full mt-2">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={cn(
                  "h-full w-full rounded-full transition-all duration-300",
                  strength >= level
                    ? strength === 1
                      ? "bg-[#bc6c25]"
                      : strength === 2
                      ? "bg-[#dda15e]"
                      : "bg-[#88994f]"
                    : "bg-[#18200e]/60"
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
PasswordField.displayName = "PasswordField";

export default PasswordField;
