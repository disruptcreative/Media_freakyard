import React from 'react';
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { AlertTriangle, Disc, Target, Zap } from 'lucide-react';

interface BriefSectionProps {
  title: string;
  role?: string;
  description?: string;
  responsibilities: string[];
  deliverables?: string[];
  notes?: string;
  image?: string;
  mood?: 'toxic' | 'neon' | 'cyber'; // Color themes
}

export const BriefSection: React.FC<BriefSectionProps> = ({
  title,
  role,
  description,
  responsibilities,
  deliverables,
  notes,
  image,
  mood = 'neon'
}) => {
  const moodColors = {
    toxic: {
      border: "border-[#FFBF00]/50",
      glow: "shadow-[0_0_30px_-10px_rgba(132,204,22,0.3)]",
      title: "text-[#FFBF00]",
      accent: "bg-[#FFBF00]",
      subtle: "bg-[#FFBF00]/30"
    },
    neon: {
      border: "border-purple-500/50",
      glow: "shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]",
      title: "text-purple-400",
      accent: "bg-purple-500",
      subtle: "bg-purple-950/30"
    },
    cyber: {
      border: "border-cyan-500/50",
      glow: "shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]",
      title: "text-cyan-400",
      accent: "bg-cyan-500",
      subtle: "bg-cyan-950/30"
    }
  };

  const theme = moodColors[mood];

  return (
    <div className={cn(
      "relative group overflow-hidden bg-black/80 backdrop-blur-xl border border-t-0 border-b-0 transition-all duration-500",
      theme.border,
      theme.glow,
      "hover:border-opacity-100 border-opacity-40"
    )}>
      
      {/* Top Tech Border */}
      <div className={cn("absolute top-0 left-0 w-full h-[1px]", theme.accent)} />
      <div className={cn("absolute top-0 left-0 w-24 h-[4px]", theme.accent)} />
      <div className={cn("absolute top-0 right-0 w-8 h-[4px]", theme.accent)} />

      {/* Bottom Tech Border */}
      <div className={cn("absolute bottom-0 left-0 w-full h-[1px]", theme.accent)} />
      <div className={cn("absolute bottom-0 right-0 w-16 h-[4px]", theme.accent)} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        
        {/* Image Section */}
        {image && (
          <div className="md:col-span-4 relative h-64 md:h-auto overflow-hidden border-r border-zinc-800">
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
             <img 
               src={image} 
               alt={title} 
               className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-110 group-hover:scale-100" 
             />
             <div className="absolute bottom-4 left-4 z-20">
               <Badge variant="outline" className={cn("bg-black/50 backdrop-blur border text-white tracking-widest uppercase rounded-none", theme.border)}>
                 {role || "CLASSIFIED"}
               </Badge>
             </div>
          </div>
        )}

        {/* Content Section */}
        <div className={cn("md:col-span-8 p-6 md:p-8 relative", !image && "md:col-span-12")}>
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
          <div className="absolute top-4 right-4 opacity-20">
            <Zap className={cn("w-12 h-12", theme.title)} />
          </div>

          <div className="relative z-10 space-y-6">
            <div>
              <h3 className={cn("text-3xl font-black uppercase tracking-tighter mb-2", theme.title)}>
                {title}
              </h3>
              {description && (
                <p className="text-zinc-400 font-mono text-sm leading-relaxed border-l-2 border-zinc-800 pl-4">
                  // {description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {responsibilities.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <Target size={14} /> Mission Objectives
                  </div>
                  <ul className="space-y-2">
                    {responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-300 group/item">
                        <span className={cn("mt-1.5 w-1 h-1 rounded-full shrink-0 transition-all group-hover/item:w-3", theme.accent)} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {deliverables && deliverables.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <Disc size={14} /> Required Artifacts
                  </div>
                   <ul className="space-y-2">
                    {deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                         <span className={cn("text-xs font-mono opacity-50", theme.title)}>[0{i+1}]</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {notes && (
              <div className={cn("mt-6 p-4 border border-dashed rounded-none flex gap-3 items-start", theme.border, theme.subtle)}>
                 <AlertTriangle className={cn("shrink-0 w-5 h-5", theme.title)} />
                 <div className="space-y-1">
                   <p className={cn("text-xs font-bold uppercase", theme.title)}>Critical Intel</p>
                   <p className="text-sm text-zinc-300 opacity-90">{notes}</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
