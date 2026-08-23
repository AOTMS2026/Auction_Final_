import { useState } from "react";
import { cn } from "@/lib/utils";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback: React.ReactNode;
}

export function FallbackImage({ src, fallback, className, ...props }: FallbackImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If no source or error, just show fallback
  if (!src || error) {
    return <div className={cn("overflow-hidden", className)}>{fallback}</div>;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && <div className="absolute inset-0 z-0">{fallback}</div>}
      <img
        src={src}
        className={cn(
          "relative z-10 size-full object-cover transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}
