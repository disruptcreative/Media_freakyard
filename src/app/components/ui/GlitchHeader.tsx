import React from 'react';
import { cn } from "../../lib/utils";

interface GlitchHeaderProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlitchHeader: React.FC<GlitchHeaderProps> = ({ text, className, size = 'lg' }) => {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl md:text-8xl",
    xl: "text-7xl md:text-9xl"
  };

  return (
    <div className={cn("relative inline-block group", className)}>
      <h1 className={cn(
        "font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 uppercase select-none relative z-10", 
        sizeClasses[size]
      )}>
        {text}
      </h1>
      
      {/* Glitch Layer 1 - Cyan */}
      <span className={cn(
        "absolute top-0 left-0 -ml-[2px] opacity-0 group-hover:opacity-70 animate-pulse text-cyan-400 font-black tracking-tighter uppercase z-0 mix-blend-screen",
        sizeClasses[size]
      )}
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, 2px)' }}
      >
        {text}
      </span>

      {/* Glitch Layer 2 - Pink */}
      <span className={cn(
        "absolute top-0 left-0 ml-[2px] opacity-0 group-hover:opacity-70 animate-pulse text-pink-500 font-black tracking-tighter uppercase z-0 mix-blend-screen",
        sizeClasses[size],
        "animation-delay-75"
      )}
      style={{ clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)', transform: 'translate(2px, -2px)' }}
      >
        {text}
      </span>
    </div>
  );
};
