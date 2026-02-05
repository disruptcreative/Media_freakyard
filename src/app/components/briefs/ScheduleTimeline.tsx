import React from 'react';
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";
import { CalendarDays, Clock, MapPin, Zap } from 'lucide-react';

interface EventDayProps {
  date: string;
  title: string;
  type: 'prep' | 'party' | 'main' | 'rest';
  hours: string;
  focus: string;
}

const days: EventDayProps[] = [
  { date: "Feb 01-02", title: "Site Setup & Tech Recce", type: 'prep', hours: "09:00 - 18:00", focus: "Drone flight paths, Cable runs, Internet tests" },
  { date: "Feb 03", title: "THE PRE-PARTY", type: 'party', hours: "20:00 - 04:00", focus: "Intimate vibes, Low light, 'Behind the velvet rope' feel" },
  { date: "Feb 04", title: "Media Day", type: 'prep', hours: "14:00 - 18:00", focus: "Artist arrivals, Soundchecks, Empty venue grandeur" },
  { date: "Feb 05", title: "WEEKEND 1 - DAY 1", type: 'main', hours: "18:00 - 04:00", focus: "The Reveal. Gates opening rush. First drops." },
  { date: "Feb 06", title: "WEEKEND 1 - DAY 2", type: 'main', hours: "18:00 - 04:00", focus: "Crowd interactions, Sunset transitions, Mainstage pyro" },
  { date: "Feb 07-11", title: "The Void (Edit Week)", type: 'rest', hours: "Remote / Hybrid", focus: "Editing rushes, Social hype maintenance, Re-charging" },
  { date: "Feb 12", title: "WEEKEND 2 - DAY 1", type: 'main', hours: "18:00 - 04:00", focus: "New angles, Hidden corners, Specific artist requests" },
  { date: "Feb 13", title: "GRAND FINALE", type: 'main', hours: "18:00 - 04:00", focus: "The Closing Ceremony. Emotion. Final fireworks. Sunrise." },
];

export const ScheduleTimeline = () => {
  return (
    <div className="space-y-6 relative">
      {/* Vertical Line */}
      <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-zinc-800 to-transparent md:left-1/2 md:-ml-[1px]" />

      {days.map((day, index) => {
        const isLeft = index % 2 === 0;
        const colorClass = 
          day.type === 'main' ? "text-[#FFBF00] border-[#FFBF00]/50 bg-[#FFBF00]/20" :
          day.type === 'party' ? "text-pink-400 border-pink-500/50 bg-pink-950/20" :
          day.type === 'prep' ? "text-cyan-400 border-cyan-500/50 bg-cyan-950/20" :
          "text-zinc-400 border-zinc-800 bg-zinc-900/50";

        return (
          <div key={index} className={cn(
            "relative flex flex-col md:flex-row items-center gap-6",
            isLeft ? "md:flex-row-reverse" : ""
          )}>
            
            {/* Content Card */}
            <Card className={cn(
              "flex-1 w-full border-l-4 md:border-l border-zinc-800 bg-black/60 backdrop-blur hover:border-zinc-600 transition-all",
              day.type === 'main' && "border-l-[#FFBF00] md:border-l-zinc-800 md:hover:border-[#FFBF00]",
              day.type === 'party' && "border-l-pink-500 md:border-l-zinc-800 md:hover:border-pink-500"
            )}>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className={cn("font-bold uppercase tracking-wider text-lg", colorClass.split(' ')[0])}>
                    {day.title}
                  </h3>
                  <Badge variant="outline" className={cn("font-mono text-xs", colorClass)}>
                    {day.date}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-400 mt-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-zinc-500" />
                    <span className="font-mono text-zinc-300">{day.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-zinc-500" />
                    <span className="italic line-clamp-1">{day.focus}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Center Dot */}
            <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 flex items-center justify-center bg-black border border-zinc-800 rounded-full z-10 shrink-0">
               <div className={cn("w-3 h-3 rounded-full animate-pulse", 
                 day.type === 'main' ? "bg-[#FFBF00]" :
                 day.type === 'party' ? "bg-pink-500" :
                 day.type === 'prep' ? "bg-cyan-500" : "bg-zinc-600"
               )} />
            </div>

            {/* Empty Spacer for desktop alignment */}
            <div className="hidden md:block flex-1" />
            
          </div>
        );
      })}
    </div>
  );
};
