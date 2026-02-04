import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { BriefSection } from "./components/briefs/BriefSection";
import { GlitchHeader } from "./components/ui/GlitchHeader";
import { ScheduleTimeline } from "./components/briefs/ScheduleTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { Badge } from "./components/ui/badge";
import { FormEvent, useEffect, useState } from "react";
import { 
  Camera, Clapperboard, Video, Plane, Share2, CheckSquare, 
  Info, ShieldAlert, Zap, Skull, Radio, Clock, Fingerprint, 
  Eye, Aperture, AlertOctagon, Calendar, BatteryCharging, HardDrive, MapPin,
  Settings, Layers, Music, Wind, AlertTriangle, FileDigit, LayoutDashboard, Grid3X3
} from "lucide-react";
import { MasterPlanBoard } from "./components/briefs/MasterPlanBoard";
import { ProductionMatrix } from "./components/briefs/ProductionMatrix";
import { cn } from "./lib/utils";

const PHOTO_CHECKLIST_SECTIONS = [
  {
    title: "SITE / LOCATION / INFRASTRUCTURE",
    items: [
      "Full site aerial (empty)",
      "Full site aerial (live)",
      "Site perimeter",
      "Site skyline",
      "Site signage from distance",
      "Entry gates (front)",
      "Entry gates (branding close-up)",
      "Queue formations",
      "Crowd flow lanes",
      "Ground markings",
      "Path lighting",
      "Site maps installed",
      "Fence branding",
      "Cranes / industrial elements",
      "Cabling runs (clean)",
      "Flooring types",
      "Ramps and accessibility paths"
    ]
  },
  {
    title: "ARRIVAL / ENTRY EXPERIENCE",
    items: [
      "Ticket scanning devices",
      "Wristband application",
      "Security checks",
      "Bag check tables",
      "Welcome staff",
      "Host gestures",
      "First crowd reactions",
      "Arrival outfits",
      "Entry lighting mood",
      "Entry soundscape elements"
    ]
  },
  {
    title: "BRANDING & GRAPHIC SYSTEM",
    items: [
      "Freaks of Nature logo applications",
      "Event title signage",
      "Typography close-ups",
      "Wayfinding signs",
      "Directional arrows",
      "Zone labels",
      "Safety signage",
      "Schedule boards",
      "Digital screens (static)",
      "Digital screens (motion)",
      "Co-branded panels",
      "Wall graphics",
      "Floor graphics",
      "Stickers",
      "Stencils",
      "Temporary prints"
    ]
  },
  {
    title: "WRISTBANDS / PASSES / ID",
    items: [
      "GA wristbands (flat)",
      "GA wristbands (worn)",
      "VIP wristbands",
      "Golden Circle wristbands",
      "Staff wristbands",
      "Media wristbands",
      "Artist wristbands",
      "Lanyards (flat)",
      "Lanyards (worn)",
      "Staff badges",
      "Media badges",
      "Artist badges",
      "VIP passes",
      "Backstage passes",
      "Credential scanning moments"
    ]
  },
  {
    title: "CONSENT & SAFETY",
    items: [
      "Opt-out lanyards",
      "Opt-out totems",
      "Consent signage",
      "Consent signage in crowd context",
      "Security staff interaction",
      "Medical tents",
      "First aid signage",
      "Fire safety equipment",
      "Crowd control barriers",
      "Calm intervention moments"
    ]
  },
  {
    title: "CROWD / AUDIENCE",
    items: [
      "Crowd wide shots",
      "Mid-density crowd shots",
      "Close crowd portraits",
      "Groups of friends",
      "Couples",
      "Solo attendees",
      "Dancing feet",
      "Hands in air",
      "Hands holding phones",
      "Sunglasses at night",
      "Fashion details",
      "Accessories",
      "Makeup",
      "Hairstyles",
      "Reactions to drops",
      "Quiet moments",
      "Resting moments",
      "Walking between stages"
    ]
  },
  {
    title: "MAINSTAGE",
    items: [
      "Mainstage wide (empty)",
      "Mainstage wide (crowded)",
      "Mainstage frontal",
      "Mainstage angled",
      "Stage depth shots",
      "Stage layers",
      "LED content close-ups",
      "Lighting rigs",
      "Truss details",
      "Pyro hardware",
      "Smoke effects",
      "DJ booth exterior",
      "DJ booth interior",
      "Crowd from stage POV",
      "Stage from crowd POV",
      "Peak moment wide",
      "Closing moment wide"
    ]
  },
  {
    title: "UNDERGROUND STAGE",
    items: [
      "Exterior entrance",
      "Queue to entrance",
      "Interior wide",
      "Ceiling structures",
      "Mapping surfaces",
      "Lighting effects",
      "DJ booth",
      "Crowd density",
      "Crowd silhouettes",
      "Sweat / movement close-ups",
      "Immersive angles",
      "Exit corridor"
    ]
  },
  {
    title: "HOUSE OF FREAKS",
    items: [
      "Exterior facade",
      "LED windows",
      "Freak Squad animations",
      "Interior wide",
      "Furniture details",
      "Props",
      "Scenic textures",
      "Lighting mood",
      "Crowd interaction",
      "Playful moments",
      "Performer reactions"
    ]
  },
  {
    title: "POP-UP STAGES",
    items: [
      "Full stage wide",
      "Branding elements",
      "Sponsor logos",
      "DJ booth",
      "Crowd interaction",
      "Lighting setups",
      "Stage at night",
      "Stage in transition"
    ]
  },
  {
    title: "ART INSTALLATIONS",
    items: [
      "Installation wide",
      "Installation close-ups",
      "Materials",
      "Interaction moments",
      "Night lighting",
      "People engaging",
      "Motion elements",
      "Abstract angles"
    ]
  },
  {
    title: "SPONSOR ACTIVATIONS",
    items: [
      "Activation exterior",
      "Activation interior",
      "Branding panels",
      "Product displays",
      "Staff uniforms",
      "Guest interaction",
      "Night lighting version",
      "Close-up logos",
      "Product-in-hand moments",
      "Queue moments"
    ]
  },
  {
    title: "BAR PROGRAM",
    items: [
      "Bar exterior wide",
      "Bar signage",
      "Menu boards",
      "Countertops",
      "Bar tools",
      "Ice bins",
      "Drink preparation",
      "Staff uniforms",
      "Payment moments",
      "Queue flow",
      "Night lighting",
      "Empty bar (pre-open)",
      "Active bar (peak)"
    ]
  },
  {
    title: "FOOD & CATERING",
    items: [
      "Food stall exterior",
      "Interior prep",
      "Packaging",
      "Menu signage",
      "Serving moments",
      "Guest reactions",
      "Seating areas",
      "Trash management stations"
    ]
  },
  {
    title: "VIP - GENERAL",
    items: [
      "VIP entrance",
      "VIP signage",
      "Access control",
      "Lounge wide (empty)",
      "Lounge wide (live)",
      "Seating layouts",
      "Decorative elements",
      "Lighting design",
      "Crowd comfort moments"
    ]
  },
  {
    title: "VIP BOXES (EACH BOX)",
    items: [
      "Box exterior",
      "Box interior wide",
      "Seating close-ups",
      "Tables",
      "Railings",
      "Flooring",
      "Lighting fixtures",
      "Branding plaques",
      "View to stage",
      "View from stage",
      "Box with guests",
      "Service moments",
      "Staff interaction",
      "Night mood shot"
    ]
  },
  {
    title: "VIP SERVICE",
    items: [
      "Hosts greeting guests",
      "Tray service",
      "Table service",
      "Guest reactions",
      "Calm conversations",
      "Premium atmosphere"
    ]
  },
  {
    title: "BACKSTAGE / OPERATIONS",
    items: [
      "Artist arrival",
      "Artist transport",
      "Backstage corridors",
      "Production offices",
      "FOH control desks",
      "Lighting consoles",
      "Sound consoles",
      "Radio communication",
      "Crew coordination",
      "Load-in activity",
      "Load-out activity"
    ]
  },
  {
    title: "MERCH / RETAIL",
    items: [
      "Merch booth exterior",
      "Merch booth interior",
      "Product flat-lays",
      "Apparel close-ups",
      "Tags and labels",
      "Payment moments",
      "People wearing merch",
      "Models wearing merch",
      "Display tables"
    ]
  },
  {
    title: "TRANSITIONS & ATMOSPHERE",
    items: [
      "Sunset over site",
      "Blue hour lighting",
      "Fog / haze",
      "Light beams in air",
      "Crowd silhouettes",
      "Long exposure motion",
      "Reflections on metal"
    ]
  },
  {
    title: "CLOSING & AFTER",
    items: [
      "Final set crowd",
      "Closing reactions",
      "People leaving",
      "Exit lighting",
      "Empty stages",
      "Empty VIP",
      "Empty bars",
      "Empty site at dawn"
    ]
  }
];

const VIDEO_CHECKLIST_ITEMS = [
  "Build phase content: timelapses, BTS build videos, social hype clips.",
  "Behind-the-scenes build videos (daily cadence).",
  "Influencer pre-party aftermovie (1 min highlights).",
  "Daily recap videos + daily highlights for all 4 days.",
  "10-15 social fun reels.",
  "Full merch coverage: models, merch booth, product storytelling.",
  "Main aftermovie: mascot-led narrative with animation and full storytelling.",
  "Per-stage aftermovies: 1-2 min each stage.",
  "Sponsor videos: 7-10 spots, up to 1 min.",
  "Artist recap videos: up to 1 min each (108 artists).",
  "B-roll library: atmosphere, infrastructure, branding, crowd."
];

const ACCESS_PASSWORD = "freaksinthedark";
const ACCESS_KEY = "freaks-of-nature-access";

const SPONSOR_CAPTURE_CHECKLIST = {
  video: [
    "Establishing shots of integration area",
    "Wide crowd context",
    "Close-up detail shots",
    "Night + lighting conditions",
    "Natural human interaction",
    "At least one transition shot usable for edits"
  ],
  photo: [
    "Wide environmental shots",
    "Medium interaction shots",
    "Detail/texture shots",
    "One clean shot usable as website header",
    "One abstract shot usable as background"
  ],
  general: [
    "Branding visible but not dominant",
    "Matches Freakyard visual language",
    "No posed or promotional behavior",
    "Safe for website + press usage"
  ]
};

const SOCIAL_RUN_OF_SHOW = [
  {
    day: "THURSDAY — WEEKEND 1 - DAY 1",
    entries: [
      {
        time: "18:00",
        format: "STORY",
        capture: "Doors open. Gates, wristbands, first crowd flow.",
        caption: "It's showtime / doors are open."
      },
      {
        time: "18:30",
        format: "STORY",
        capture: "Wristband macro, signage, wayfinding, map boards.",
        caption: "Welcome to The Freakyard."
      },
      {
        time: "19:00",
        format: "STORY",
        capture: "The Freakyard wide. Entry mood, skyline, first movement.",
        caption: "The Freakyard."
      },
      {
        time: "19:30",
        format: "STORY",
        capture: "Stage build energy. Lighting test, sound check, crew in motion.",
        caption: "Build to first drop."
      },
      {
        time: "20:30",
        format: "SOCIAL POST",
        capture: "People portraits + crowd texture.",
        caption: "People of Freaks of Nature."
      },
      {
        time: "21:00",
        format: "STORY",
        capture: "Downtown social anchor. Seating, chill zones, small moments.",
        caption: "Downtown."
      },
      {
        time: "22:00",
        format: "STORY",
        capture: "Mainstage wide with lighting shift and crowd wave.",
        caption: "MAINSTAGE."
      },
      {
        time: "22:30",
        format: "SOCIAL POST",
        capture: "Underground wide + crowd density.",
        caption: "Underground."
      },
      {
        time: "23:30",
        format: "STORY",
        capture: "House of Freaks details. Costumes, textures, close interactions.",
        caption: "HOUSE OF FREAKS."
      },
      {
        time: "01:15",
        format: "SOCIAL POST",
        capture: "UGC pull. Real attendee angle.",
        caption: "User generated post."
      },
      {
        time: "02:00",
        format: "REEL",
        capture: "Reel video. Drops, crowd reactions, lighting shifts.",
        caption: "Reel video."
      },
      {
        time: "02:45",
        format: "STORY",
        capture: "Crowd peak. Hands, lights, silhouettes.",
        caption: "Night pulse."
      },
      {
        time: "04:00",
        format: "SOCIAL POST",
        capture: "Close-out. Empty stages, exit lighting, final reactions.",
        caption: "Thank you post."
      },
      {
        time: "04:15",
        format: "STORY",
        capture: "Exit flow. Transport, walk-out, sunrise hint.",
        caption: "See you tomorrow."
      }
    ]
  },
  {
    day: "FRIDAY — WEEKEND 1 - DAY 2",
    entries: [
      {
        time: "13:00",
        format: "SOCIAL POST",
        capture: "Recap selects from Day 1. Hero moments only.",
        caption: "WEEKEND 1 - DAY 1."
      },
      {
        time: "15:00",
        format: "STORY",
        capture: "Quick recap montage from Day 1. Simple phone cuts.",
        caption: "Weekend 1 continues tonight."
      },
      {
        time: "17:30",
        format: "STORY",
        capture: "Doors open. Entry flow + wristbands.",
        caption: "It's showtime / doors are open."
      },
      {
        time: "18:30",
        format: "STORY",
        capture: "Lineup boards, map, stage signage. Fast pan.",
        caption: "Plan your route."
      },
      {
        time: "19:00",
        format: "SOCIAL POST",
        capture: "Mainstage wide + drop moment.",
        caption: "MAINSTAGE."
      },
      {
        time: "20:00",
        format: "STORY",
        capture: "Underground queue or entrance. Movement, anticipation.",
        caption: "Underground."
      },
      {
        time: "21:00",
        format: "STORY",
        capture: "VIP - GENERAL calm moments + lounge.",
        caption: "VIP - GENERAL."
      },
      {
        time: "22:00",
        format: "SOCIAL POST",
        capture: "VIP BOXES (EACH BOX) service moment.",
        caption: "VIP BOXES (EACH BOX)."
      },
      {
        time: "23:00",
        format: "STORY",
        capture: "Downtown night. Social anchor, resting, gathering.",
        caption: "Downtown."
      },
      {
        time: "00:30",
        format: "SOCIAL POST",
        capture: "House of Freaks mood + close-up interactions.",
        caption: "HOUSE OF FREAKS."
      },
      {
        time: "01:30",
        format: "STORY",
        capture: "Merch, costumes, detail textures. Quick macro shots.",
        caption: "Details."
      },
      {
        time: "03:00",
        format: "SOCIAL POST",
        capture: "Closing reactions + exit flow.",
        caption: "Thank you post."
      },
      {
        time: "03:30",
        format: "STORY",
        capture: "Exit flow. Short goodbye clips, calm walk-out.",
        caption: "See you tomorrow."
      }
    ]
  },
  {
    day: "THURSDAY — WEEKEND 2 - DAY 1",
    entries: [
      {
        time: "13:00",
        format: "SOCIAL POST",
        capture: "Recap selects from Weekend 1. Missing angles + highlights.",
        caption: "WEEKEND 1."
      },
      {
        time: "15:00",
        format: "STORY",
        capture: "Weekend 2 teaser. Quick cuts from W1 + empty venue reset.",
        caption: "Weekend 2."
      },
      {
        time: "18:00",
        format: "STORY",
        capture: "The Freakyard wide. Entry mood + return energy.",
        caption: "The Freakyard."
      },
      {
        time: "18:30",
        format: "STORY",
        capture: "Wristband close-ups + gate flow. Easy handheld.",
        caption: "Doors open."
      },
      {
        time: "19:00",
        format: "STORY",
        capture: "Downtown or wayfinding. Simple establishing sweep.",
        caption: "Downtown."
      },
      {
        time: "20:30",
        format: "SOCIAL POST",
        capture: "People portraits + crowd texture.",
        caption: "People of Freaks of Nature."
      },
      {
        time: "21:30",
        format: "STORY",
        capture: "Mainstage wide. Crowd scale, lighting, hands.",
        caption: "MAINSTAGE."
      },
      {
        time: "22:30",
        format: "SOCIAL POST",
        capture: "Underground or House of Freaks. Choose the strongest moment.",
        caption: "UNDERGROUND / HOUSE OF FREAKS."
      },
      {
        time: "23:30",
        format: "STORY",
        capture: "VIP BOXES (EACH BOX). Quick ambience, service moments.",
        caption: "VIP BOXES (EACH BOX)."
      },
      {
        time: "01:15",
        format: "SOCIAL POST",
        capture: "UGC pull. Real attendee angle.",
        caption: "User generated post."
      },
      {
        time: "02:00",
        format: "REEL",
        capture: "Reel video. Drops, crowd reactions, lighting shifts.",
        caption: "Reel video."
      },
      {
        time: "03:00",
        format: "STORY",
        capture: "Crowd peak. Lasers, silhouettes, motion blur.",
        caption: "Night pulse."
      },
      {
        time: "04:00",
        format: "SOCIAL POST",
        capture: "Close-out. Empty stages, exit lighting, final reactions.",
        caption: "Thank you post."
      }
    ]
  },
  {
    day: "FRIDAY — WEEKEND 2 - DAY 2 (GRAND FINALE)",
    entries: [
      {
        time: "13:00",
        format: "SOCIAL POST",
        capture: "Recap selects from Weekend 2 - Day 1.",
        caption: "WEEKEND 2 - DAY 1."
      },
      {
        time: "15:00",
        format: "STORY",
        capture: "Final night reminder. Empty venue reset + prep shots.",
        caption: "Final night."
      },
      {
        time: "17:30",
        format: "STORY",
        capture: "Doors open. Entry flow + wristbands.",
        caption: "It's showtime / doors are open."
      },
      {
        time: "18:30",
        format: "STORY",
        capture: "Lineup boards + entry energy. Quick handheld.",
        caption: "Plan your route."
      },
      {
        time: "20:00",
        format: "SOCIAL POST",
        capture: "Mainstage wide + peak moment.",
        caption: "MAINSTAGE."
      },
      {
        time: "21:00",
        format: "STORY",
        capture: "Downtown night flow. Social anchor, refresh points.",
        caption: "Downtown."
      },
      {
        time: "22:00",
        format: "SOCIAL POST",
        capture: "Underground wide + crowd density.",
        caption: "UNDERGROUND."
      },
      {
        time: "23:00",
        format: "STORY",
        capture: "VIP BOXES (EACH BOX) ambience. Calm, premium moments.",
        caption: "VIP BOXES (EACH BOX)."
      },
      {
        time: "00:30",
        format: "SOCIAL POST",
        capture: "House of Freaks mood + close-up interactions.",
        caption: "HOUSE OF FREAKS."
      },
      {
        time: "01:30",
        format: "STORY",
        capture: "Crowd peak + stage lights. Quick 10-15s clips.",
        caption: "Last call."
      },
      {
        time: "02:00",
        format: "REEL",
        capture: "Final Closing Ceremony moments.",
        caption: "The Final Closing Ceremony."
      },
      {
        time: "03:00",
        format: "STORY",
        capture: "Exit flow. Slow fade, last lights, empty lanes.",
        caption: "Goodnight."
      },
      {
        time: "04:00",
        format: "SOCIAL POST",
        capture: "Closing reactions + exit flow.",
        caption: "Thank you post."
      }
    ]
  },
  {
    day: "POST-EVENT (FEB 14+)",
    entries: [
      {
        time: "12:00",
        format: "SOCIAL POST",
        capture: "Best selects across all days.",
        caption: "Best of Festival Collection (Top 50 All-time)."
      },
      {
        time: "14:00",
        format: "STORY",
        capture: "UGC roundup. Repost real attendee clips.",
        caption: "Find yourself in the crowd."
      },
      {
        time: "18:00",
        format: "SOCIAL POST",
        capture: "People of Freakyard gallery. Faces, outfits, textures.",
        caption: "People of Freaks of Nature."
      },
      {
        time: "20:00",
        format: "SOCIAL POST",
        capture: "Main aftermovie release.",
        caption: "Main aftermovie."
      },
      {
        time: "20:30",
        format: "SOCIAL POST",
        capture: "Per-stage aftermovies.",
        caption: "Per-stage aftermovies: 1-2 min each stage."
      },
      {
        time: "21:00",
        format: "SOCIAL POST",
        capture: "Artist recap drops schedule.",
        caption: "Artist recap drops."
      }
    ]
  }
];

const VIDEO_UPLOAD_LINKS = [
  {
    label: "Video Upload Folder",
    href: "https://drive.google.com/drive/folders/1xgV6OEawFORzIJvP-9d7HEB-hnBMhQON"
  },
  {
    label: "Videos Folder",
    href: "https://drive.google.com/drive/folders/1MydNMZy22UQvAndvbx2lM4cpsKst61aH"
  }
];

const UploadLinksCard = () => (
  <Card className="bg-zinc-900 border-zinc-800">
    <CardHeader>
      <CardTitle className="text-[#FFBF00]">Upload Links</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="text-sm text-zinc-400">Use the correct folder for every delivery. Do not mix uploads.</p>
      <div className="flex flex-wrap gap-3">
        {VIDEO_UPLOAD_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-[#FFBF00] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#FFBF00]/90"
          >
            {link.label}
          </a>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(ACCESS_KEY);
    if (stored === "true") {
      setIsAuthed(true);
    }
  }, []);

  const handleAccessSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (passwordInput === ACCESS_PASSWORD) {
      window.localStorage.setItem(ACCESS_KEY, "true");
      setIsAuthed(true);
      setPasswordError("");
    } else {
      setPasswordError("Invalid password.");
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 font-sans flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-zinc-950/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-3 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Restricted Access</div>
            <h1 className="text-2xl font-black uppercase text-white">Freaks of Nature</h1>
            <p className="text-sm text-zinc-400">Enter the access password to continue.</p>
          </div>
          <form onSubmit={handleAccessSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                className="w-full rounded-lg bg-black/60 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FFBF00]/60"
                placeholder="••••••••••••"
                autoFocus
              />
              {passwordError ? (
                <div className="text-xs text-red-400">{passwordError}</div>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full bg-[#FFBF00] text-black font-bold uppercase text-xs tracking-wider py-3 rounded-lg hover:bg-[#FFBF00]/90 transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-[#FFBF00]/50 selection:text-black overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND NOISE & GRADIENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        
        {/* HEADER SECTION */}
        <header className="mb-16 text-center space-y-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-32 bg-purple-600/20 blur-[60px] -z-10"></div>
          
          <div className="flex justify-center mb-4">
             <Badge variant="outline" className="border-[#FFBF00] text-[#FFBF00] px-4 py-1 tracking-[0.3em] uppercase bg-[#FFBF00]/30 animate-pulse">
               Classified Production Brief
             </Badge>
          </div>

          <GlitchHeader text="FREAKS OF NATURE" size="xl" />
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-zinc-400 font-mono text-sm">
             <span className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-[#FFBF00]" /> Feb 03 - Feb 13
             </span>
             <span className="hidden md:inline text-zinc-700">|</span>
             <span className="flex items-center gap-2">
               <MapPin className="w-4 h-4 text-pink-500" /> The Freakyard
             </span>
              <span className="hidden md:inline text-zinc-700">|</span>
             <span className="flex items-center gap-2">
               <Radio className="w-4 h-4 text-cyan-500" /> All Teams
             </span>
          </div>
        </header>

        {/* MAIN NAVIGATION & CONTENT */}
        <Tabs defaultValue="schedule" className="space-y-12">
          
          {/* NAVIGATION BAR */}
          <div className="sticky top-6 z-50 flex justify-center">
            <div className="bg-black/80 backdrop-blur-md p-1.5 rounded-full border border-zinc-800 shadow-2xl overflow-x-auto max-w-full">
              <TabsList className="bg-transparent h-auto p-0 gap-1">
                <TabTrigger value="schedule" icon={<Calendar size={18} />} label="Timeline" />
                <TabTrigger value="masterplan" icon={<LayoutDashboard size={18} />} label="Kanban" />
                <TabTrigger value="matrix" icon={<Grid3X3 size={18} />} label="Matrix" />
                <TabTrigger value="overview" icon={<Info size={18} />} label="Mission" />
                <TabTrigger value="photo" icon={<Camera size={18} />} label="Photo" />
                <TabTrigger value="video" icon={<Video size={18} />} label="Video" />
                <TabTrigger value="drone" icon={<Plane size={18} />} label="Drone" />
                <TabTrigger value="smm" icon={<Share2 size={18} />} label="Socials" />
                <TabTrigger value="checklist" icon={<CheckSquare size={18} />} label="Checklist" />
              </TabsList>
            </div>
          </div>

          {/* 0. SCHEDULE TAB (NEW) */}
           <TabsContent value="schedule" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <UploadLinksCard />
             <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFBF00] to-cyan-400">
                  Operation Timeline
                </h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                  The operation is split into three critical phases: <span className="text-white">The Setup</span>, <span className="text-[#FFBF00]">The Weekends</span>, and <span className="text-cyan-400">The Gap</span>. Endurance is key.
                </p>
             </div>
             
             <ScheduleTimeline />

             {/* THE GAP WEEK INFO */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <InfoCard 
                  title="The Gap Week (Feb 7-11)" 
                  icon={<BatteryCharging className="text-yellow-500" />}
                  content="This is NOT time off. This is catch-up time. Edit all Weekend 1 rushes. Pre-plan Weekend 2 shoots based on what we missed. Re-charge batteries and clean sensors."
                />
                <InfoCard 
                  title="Data Management" 
                  icon={<HardDrive className="text-blue-500" />}
                  content="We will generate ~40TB of data. Daily dumps are mandatory. Do not format cards until verified by Khalid on the Master Drive."
                />
                 <InfoCard 
                  title="Double Weekend Strategy" 
                  icon={<Zap className="text-purple-500" />}
                  content="Weekend 1 is for capturing the ENERGY. Weekend 2 is for capturing the DETAILS and specific missing links. Learn from Week 1."
                />
             </div>
           </TabsContent>

          {/* 0.5 MASTER PLAN TAB (KANBAN) */}
          <TabsContent value="masterplan" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <UploadLinksCard />
             <MasterPlanBoard />
          </TabsContent>

          {/* 0.6 PRODUCTION MATRIX TAB (NEW) */}
          <TabsContent value="matrix" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <UploadLinksCard />
             <ProductionMatrix />
          </TabsContent>

          {/* 1. OVERVIEW / MISSION TAB */}
          <TabsContent value="overview" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <UploadLinksCard />
            
            {/* The Vision */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <h2 className="text-4xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                  Two Weekends. <br/> One Legacy.
                </h2>
                <div className="prose prose-invert text-zinc-300 text-lg leading-relaxed">
                  <p>
                    <span className="text-[#FFBF00] font-bold">Freakyard Episode 7</span> is our most ambitious production yet. 
                    Spanning <span className="text-white font-bold border-b border-white/50">two massive weekends</span> and an exclusive pre-party, we are creating a documentary-level archive of the madness.
                  </p>
                  <p>
                    We need <span className="text-pink-500 font-bold">Tomorrowland-level quality</span> with a dirty, underground soul. 
                    Clean compositions, but gritty subjects. Neon lights cutting through fog. 
                    Rust, metal, fire, and bass.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <StatCard label="Stages" value="3" sub="Main / Underground / HoF" color="cyan" />
                  <StatCard label="Days" value="5+" sub="Total Live Operations" color="pink" />
                </div>
              </div>

              {/* STAGES MAP (Conceptual) */}
              <div className="grid gap-4">
                 <div className="p-6 bg-zinc-900/50 border border-zinc-800 relative overflow-hidden group hover:border-[#FFBF00]/50 transition-all">
                    <div className="absolute top-0 right-0 p-2 opacity-50"><Zap className="text-[#FFBF00]"/></div>
                    <h3 className="text-xl font-bold text-[#FFBF00] mb-2">MAINSTAGE</h3>
                    <p className="text-sm text-zinc-400">The Beating Heart. Pyro, massive crowds, headliners. Wide angles to show scale.</p>
                 </div>
                 <div className="p-6 bg-zinc-900/50 border border-zinc-800 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                    <div className="absolute top-0 right-0 p-2 opacity-50"><Skull className="text-purple-500"/></div>
                    <h3 className="text-xl font-bold text-purple-400 mb-2">UNDERGROUND</h3>
                    <p className="text-sm text-zinc-400">The Dark Soul. Concrete, darkness, strobes. High ISO, fast lenses needed.</p>
                 </div>
                 <div className="p-6 bg-zinc-900/50 border border-zinc-800 relative overflow-hidden group hover:border-pink-500/50 transition-all">
                    <div className="absolute top-0 right-0 p-2 opacity-50"><Eye className="text-pink-500"/></div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">HOUSE OF FREAKS</h3>
                    <p className="text-sm text-zinc-400">The Weirdness. Performers, costumes, close-up interactions. Get weird here.</p>
                 </div>
              </div>
            </div>

            {/* COVERAGE WARNING */}
            <div className="bg-red-950/20 border-l-4 border-red-500 p-6 relative overflow-hidden">
               <div className="absolute -right-10 -top-10 text-red-900/20 rotate-12">
                 <ShieldAlert size={200} />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                 <div className="bg-red-500/20 p-4 rounded-full">
                   <AlertOctagon className="text-red-500 w-10 h-10" />
                 </div>
                 <div className="flex-1">
                   <h3 className="text-2xl font-bold text-red-500 uppercase tracking-wider mb-2">Respectful Coverage Guidelines</h3>
                   <p className="text-zinc-300 mb-4">
                     Avoid shooting anyone who is not appropriately dressed. If in doubt, reframe, move, or shoot another angle.
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono text-red-300">
                     <div className="bg-black/40 p-2 border border-red-900/50">
                       [!] Do not take close-ups of anyone not appropriately dressed.
                     </div>
                     <div className="bg-black/40 p-2 border border-red-900/50">
                       [!] If they appear in a wide shot, avoid using it or blur them in post.
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* TEAM CONTACTS */}
            <div className="border border-zinc-800 bg-zinc-950/50 p-8">
               <h3 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
                 <Fingerprint className="text-zinc-500" /> Team Contacts
               </h3>
               <div className="space-y-8">
                 <div className="space-y-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Leadership</div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <TeamMember name="Alex Betcu" role="Creative Director" icon="🎨" color="text-[#FFBF00]" contact="+31616258362" note="Emergency Contact" />
                     <TeamMember name="Khalid Al Mula" role="Content Manager" icon="👑" color="text-yellow-500" contact="+966505964477" />
                     <TeamMember name="Tareq Saleh" role="Supervisor Media Lead (LEAD Company)" icon="🧭" color="text-orange-400" contact="+966507079147" />
                   </div>
                 </div>

                 <div className="space-y-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Photography</div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <TeamMember name="Martin Hols" role="Photography Lead (Week 1-2)" icon="📸" color="text-cyan-400" contact="+31641148479" />
                     <TeamMember name="Bobbie Romy van den Bosch" role="Photographer (Week 2)" icon="📷" color="text-sky-400" />
                     <TeamMember name="Menno van der Veen" role="Photographer (Week 2)" icon="📷" color="text-sky-400" />
                     <TeamMember name="Max Henricus Kneefel" role="Photographer (Week 1)" icon="📷" color="text-sky-400" />
                     <TeamMember name="Tifanny Maria Konings" role="Photographer (Week 1)" icon="📷" color="text-sky-400" />
                     <TeamMember name="Jan Niklas" role="Photographer (Week 1-2)" icon="📷" color="text-sky-400" />
                   </div>
                 </div>

                 <div className="space-y-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Videography</div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <TeamMember name="Patryk Semkło (Steady)" role="Videographer" icon="🎥" color="text-purple-400" contact="+48 791 143 550" />
                     <TeamMember name="Ales" role="Videographer" icon="🎥" color="text-purple-400" contact="+420 733 564 811" />
                     <TeamMember name="David" role="Videographer" icon="🎥" color="text-purple-400" contact="+420 728 126 080" />
                     <TeamMember name="Jacek Sikorski (Jacek)" role="Videographer" icon="🎥" color="text-purple-400" contact="+48 690 038 050" />
                     <TeamMember name="Tymon Żak (Hari)" role="Videographer" icon="🎥" color="text-purple-400" />
                     <TeamMember name="Sayed" role="Videographer (Detail Unit — HoF Focus)" icon="🎥" color="text-purple-400" contact="+966 53 169 8078" />
                     <TeamMember name="TBD 1" role="Videographer (Detail Unit — HoF Focus)" icon="🎥" color="text-purple-400" />
                     <TeamMember name="TBD 2" role="Videographer (Detail Unit — HoF Focus)" icon="🎥" color="text-purple-400" />
                   </div>
                 </div>

                 <div className="space-y-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Drone</div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <TeamMember name="TBA 1" role="Drone Operator" icon="🛰️" color="text-blue-400" />
                     <TeamMember name="TBA 2" role="Drone Operator" icon="🛰️" color="text-blue-400" />
                     <TeamMember name="Ahmed Hadi" role="Drone Operator" icon="🛰️" color="text-blue-400" contact="+966548440840" />
                     <TeamMember name="TBA" role="FPV Drone Operator" icon="🛸" color="text-blue-400" />
                   </div>
                 </div>
               </div>
            </div>
          </TabsContent>

          {/* 2. PHOTOGRAPHY TAB */}
          <TabsContent value="photo" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             
             <UploadLinksCard />
             
             {/* PHOTOGRAPHY QUICK GUIDE */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TechSpecCard 
                  title="File Protocols" 
                  icon={<FileDigit className="text-cyan-400" />}
                  specs={[
                    "Format: RAW + JPG (Fine)",
                    "Color Space: sRGB (immediate social export)",
                    "Keep a mirrored JPG folder for fast delivery"
                  ]}
                />
                <TechSpecCard 
                  title="Capture Rules" 
                  icon={<Settings className="text-[#FFBF00]" />}
                  specs={[
                    "Fast glass: f/2.8 or faster mandatory",
                    "No flash on stage unless authorized",
                    "Flash only for crowd portraits (rear-curtain sync)",
                    "Minimum shutter: 1/250 crowd, 1/500 stage"
                  ]}
                />
                <TechSpecCard 
                  title="Delivery Timing" 
                  icon={<Clock className="text-pink-400" />}
                  specs={[
                    "Live gallery: continuous uploads",
                    "Top 20 selects: within 2 hours of gates",
                    "Full edited gallery: by 10:00 AM next day",
                    "Best of Festival: Top 50 after final night"
                  ]}
                />
             </div>

             <Card className="bg-zinc-900 border-zinc-800">
               <CardHeader>
                 <CardTitle className="text-[#FFBF00]">Shot Priority Stack (Easy Wins First)</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                 <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                   <li>Wide scale: Mainstage + crowd density.</li>
                   <li>People portraits: energy, fashion, group shots.</li>
                   <li>Stage moments: drops, confetti, silhouettes, hands.</li>
                   <li>Downtown + House of Freaks: social anchor and details.</li>
                   <li>VIP - GENERAL and VIP BOXES (EACH BOX) ambience.</li>
                 </ul>
               </CardContent>
             </Card>

             <Card className="bg-zinc-900 border-zinc-800">
               <CardHeader>
                 <CardTitle className="text-[#FFBF00]">Dates & Focus</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                 <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                   <li>Feb 1-4: Build, pre-party, and setup atmosphere.</li>
                   <li>Feb 5-6: Weekend 1 scale + energy.</li>
                   <li>Feb 12-13: Weekend 2 emotion + final moments.</li>
                 </ul>
               </CardContent>
             </Card>

             <Card className="bg-zinc-900 border-zinc-800">
               <CardHeader>
                 <CardTitle className="text-cyan-400">Coverage Map (What Must Be Captured)</CardTitle>
               </CardHeader>
               <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-300">
                 <div className="bg-black/40 border border-zinc-800 rounded p-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Mainstage</div>
                   <p className="mt-2">Wide crowd, laser moments, DJ hands, FOH view.</p>
                 </div>
                 <div className="bg-black/40 border border-zinc-800 rounded p-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Underground</div>
                   <p className="mt-2">Low-light energy, density, silhouettes, crowd movement.</p>
                 </div>
                 <div className="bg-black/40 border border-zinc-800 rounded p-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">House of Freaks</div>
                   <p className="mt-2">Costumes, textures, close-ups, intimate moments.</p>
                 </div>
                 <div className="bg-black/40 border border-zinc-800 rounded p-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Downtown</div>
                   <p className="mt-2">Social anchor, people resting, group moments.</p>
                 </div>
                 <div className="bg-black/40 border border-zinc-800 rounded p-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">VIP - GENERAL</div>
                   <p className="mt-2">Calm premium atmosphere, lounge, small groups.</p>
                 </div>
                 <div className="bg-black/40 border border-zinc-800 rounded p-3">
                   <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">VIP BOXES (EACH BOX)</div>
                   <p className="mt-2">Box interiors, service moments, wide + detail.</p>
                 </div>
               </CardContent>
             </Card>

             <Card className="bg-zinc-900 border-zinc-800">
               <CardHeader>
                 <CardTitle className="text-pink-400">On-Show Workflow</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                 <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                   <li>Capture in both vertical and horizontal for every key moment.</li>
                   <li>Upload frequently to keep the live gallery fresh.</li>
                   <li>Use the correct Drive folder for every upload. Do not mix.</li>
                   <li>Tag by stage + time so Social can find fast.</li>
                   <li>Respectful coverage only. Avoid shooting people not appropriately dressed.</li>
                 </ul>
               </CardContent>
             </Card>
          </TabsContent>

          {/* 3. VIDEO TAB */}
          <TabsContent value="video" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             
             <UploadLinksCard />
             
             {/* TECHNICAL SPECS VIDEO */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TechSpecCard 
                  title="Recording Format" 
                  icon={<FileDigit className="text-purple-400" />}
                  specs={[
                    "Res: 4K UHD (3840x2160)",
                    "FPS: 60fps Base (Slow-mo ready)",
                    "Codec: ProRes 422 or XAVC-S-I (High Bitrate)",
                    "Log Profile: S-Log3 / V-Log mandatory"
                  ]}
                />
                <TechSpecCard 
                  title="Audio Sync" 
                  icon={<Music className="text-pink-400" />}
                  specs={[
                    "Timecode Sync via Tentacle (if available).",
                    "Scratch Audio: Always ON.",
                    "Lavaliers for artist interviews.",
                    "Soundboard feed recording: -12dB safety."
                  ]}
                />
                <TechSpecCard 
                   title="Delivery Specs"
                   icon={<Layers className="text-indigo-400" />}
                   specs={[
                     "Reels: 1080x1920 (9:16) @ 30fps",
                     "YouTube/TV: 3840x2160 (16:9) @ 24fps",
                     "Clean Feed: No baked-in text/subs."
                   ]}
                />
             </div>

             {/* TIMELINE BREAKDOWN VIDEO */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="bg-zinc-900 border-l-4 border-l-[#FFBF00] border-zinc-800">
                   <div className="p-4">
                     <h4 className="font-bold text-[#FFBF00]">WEEKEND 1 STRATEGY</h4>
                     <p className="text-sm text-zinc-400 mt-2">Focus on <span className="text-white">SCALE and ENERGY</span>. We need to show the world how big this is to sell out Weekend 2.</p>
                   </div>
                </Card>
                <Card className="bg-zinc-900 border-l-4 border-l-cyan-500 border-zinc-800">
                   <div className="p-4">
                     <h4 className="font-bold text-cyan-400">WEEKEND 2 STRATEGY</h4>
                     <p className="text-sm text-zinc-400 mt-2">Focus on <span className="text-white">EMOTION and COMMUNITY</span>. Interviews, hugs, close-ups. This is for the Aftermovie.</p>
                   </div>
                </Card>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BriefSection 
                  mood="toxic"
                  title="Team Relive (Set Prod)"
                  role="Performance Capture"
                  description="Documentation of the musical journey."
                  responsibilities={[
                    "Ales to coordinate Mic Cams (GoPros). Essential for that POV feel.",
                    "Capture audio feed directly from soundboard (Redundancy recorder).",
                    "Capture crowd reaction during drops. Turn the camera around!",
                    "Get the 'DJ Hand' shots. Knobs twisting, faders sliding."
                  ]}
                  deliverables={[
                    "5x Vertical Shorts (15-30s) per artist. RAPID turnaround.",
                    "Full Set 4K Export (ProRes LT or equivalent).",
                    "Separate audio tracks synced."
                  ]}
                />

                <BriefSection 
                  mood="cyber"
                  title="Hero Cinematic Team"
                  role="Storytellers"
                  description="Making the movie. Emotional, slow-mo, epic."
                  responsibilities={[
                    "High frame rates (60/120fps) for slow motion.",
                    "Gimbal work for smooth crowd movement.",
                    "Timelapses of stage construction/crowd fill.",
                    "Narrative shots: People entering -> Anticipation -> Madness -> Aftermath."
                  ]}
                  deliverables={[
                    "DAILY AFTERMOVIE (60s). Must be ready by 8 AM.",
                    "Vertical cuts of best moments for Reels.",
                    "Raw selection for Motion Team."
                  ]}
                  notes="The Daily Aftermovie is our #1 marketing tool for ticket sales next day. It cannot be late."
                />
             </div>

             <div className="mt-8">
                <BriefSection
                  mood="neon"
                  title="Video Deliverables Matrix"
                  role="Outputs"
                  description="Full festival video requirements and cadence."
                  responsibilities={[
                    "Build a pipeline from build phase through final exports.",
                    "Publish daily recaps and social cuts with fast turnaround.",
                    "Coordinate artist, sponsor, and stage recaps across all days."
                  ]}
                  deliverables={[
                    "Build phase content: timelapses, BTS build videos, social hype clips.",
                    "Influencer pre-party aftermovie (1 min highlights).",
                    "Daily recap videos + daily highlights for all 4 days.",
                    "10-15 social fun reels.",
                    "Merch coverage: models, booth, product storytelling.",
                    "Main aftermovie: mascot-led narrative with animation and full storytelling.",
                    "Per-stage aftermovies: 1-2 min each stage.",
                    "Sponsor videos: 7-10 spots, up to 1 min.",
                    "Artist recap videos: up to 1 min each (108 artists).",
                    "B-roll library: atmosphere, infrastructure, branding, crowd."
                  ]}
                />
             </div>
             
             <div className="mt-8">
                <BriefSection
                  mood="neon"
                  title="Detail Unit (House of Freaks)"
                  role="Micro Moments"
                  description="Smaller scope team focused on details and intimate moments, mostly in House of Freaks."
                  responsibilities={[
                    "Close-ups of decor, props, costumes, and textures.",
                    "Short performance snippets (10-30s) for socials.",
                    "Audience reactions in HoF — keep it tasteful and respectful.",
                    "Ambient b-roll: lights, signage, hands, movement."
                  ]}
                  deliverables={[
                    "Daily micro-reel pack (10-15 clips).",
                    "Detail b-roll folder tagged by location.",
                    "At least 3 HoF story-ready clips per hour."
                  ]}
                />
             </div>

             {/* PARTNER INTEGRATIONS */}
             <div className="border border-zinc-800 bg-zinc-950/50 p-8 space-y-8">
               <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-white">Partner Integrations — Content Guidelines</h3>
                 <p className="text-sm text-zinc-400">
                   Internal brief aligned to <span className="text-[#FFBF00] font-bold">Freakyard Episode 7</span> and <span className="text-white font-bold">The Freakyard</span>. Use existing space names (Mainstage, Underground, House of Freaks, VIP - GENERAL, VIP BOXES (EACH BOX)). Partner presence is supporting, not featured.
                 </p>
               </div>

               <div className="space-y-8">
                 {/* ENERGIA */}
                 <div className="bg-black/40 border border-zinc-800/60 rounded-lg p-6 space-y-6">
                   <h4 className="text-xl font-bold text-[#FFBF00]">ENERGIA</h4>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Integration Context</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Provides generators powering the site.</li>
                       <li>Provides tents across the venue.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Website Placement</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Video → Team Relive (Set Prod) — Supporting content block (inline media).</li>
                       <li>Video → Hero Cinematic Team — Background visual.</li>
                       <li>Video → Video Deliverables Matrix — Supporting content block (inline media).</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Visual Direction</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Focus on infrastructure, scale, reliability.</li>
                       <li>Generators, cabling, tents in use.</li>
                       <li>Shots during build, dusk, night.</li>
                       <li>Human moments underneath tents.</li>
                       <li>Energy as continuity, not hype.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Show Day Capture</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Generators in use with visible load.</li>
                       <li>Cabling runs and power distribution in context.</li>
                       <li>Tents active with crew and guests underneath.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Video Content (Required)</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Hero video: 60 seconds.</li>
                       <li>Cutdowns supported.</li>
                       <li>Moments: generators in use, cabling runs, tents in live operation, dusk to night transitions.</li>
                       <li>Presence shows as infrastructure, space, and continuity (never ads).</li>
                       <li>Do not show: forced product shots, crowd posing.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Photo Content (Required)</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Environmental shots of tents and generator zones.</li>
                       <li>Detail shots: cabling, panels, connectors, signage.</li>
                       <li>Human interaction: crew under tents, guests using covered areas.</li>
                       <li>Used for website galleries, page backgrounds, and supporting visuals under text.</li>
                     </ul>
                   </div>

                   <div className="space-y-4">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Content Capture Checklist</div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="space-y-2">
                         <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">VIDEO</div>
                         {SPONSOR_CAPTURE_CHECKLIST.video.map((item, index) => (
                           <CheckItem key={`energia-video-${index}`} text={item} />
                         ))}
                       </div>
                       <div className="space-y-2">
                         <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">PHOTO</div>
                         {SPONSOR_CAPTURE_CHECKLIST.photo.map((item, index) => (
                           <CheckItem key={`energia-photo-${index}`} text={item} />
                         ))}
                       </div>
                       <div className="space-y-2">
                         <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">GENERAL</div>
                         {SPONSOR_CAPTURE_CHECKLIST.general.map((item, index) => (
                           <CheckItem key={`energia-general-${index}`} text={item} />
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* SUNCOLA */}
                 <div className="bg-black/40 border border-zinc-800/60 rounded-lg p-6 space-y-6">
                   <h4 className="text-xl font-bold text-[#FFBF00]">SUNCOLA</h4>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Integration Context</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Dedicated space in Downtown.</li>
                       <li>Activations.</li>
                       <li>Large screen.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Website Placement</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Video → Hero Cinematic Team — Gallery.</li>
                       <li>Video → Video Deliverables Matrix — Supporting content block (inline media).</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Visual Direction</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Downtown as a social anchor.</li>
                       <li>Activation moments in context.</li>
                       <li>Big screen with crowd reacting, resting, gathering.</li>
                       <li>Bright but grounded. Social, not staged.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Show Day Capture</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Downtown space active with natural flow.</li>
                       <li>Activations mid-use with real interaction.</li>
                       <li>Large screen in wide context and close detail.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Video Content (Required)</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Hero video: 60 seconds.</li>
                       <li>Cutdowns supported.</li>
                       <li>Moments: Downtown flow, activation use, screen context, social anchors.</li>
                       <li>Presence shows as space and experience (never ads).</li>
                       <li>Do not show: forced product shots, crowd posing.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Photo Content (Required)</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Environmental shots of Downtown and activation footprint.</li>
                       <li>Detail shots: screen, signage, activation elements.</li>
                       <li>Human interaction: resting, gathering, reacting.</li>
                       <li>Used for website galleries, page backgrounds, and supporting visuals under text.</li>
                     </ul>
                   </div>

                   <div className="space-y-4">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Content Capture Checklist</div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="space-y-2">
                         <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">VIDEO</div>
                         {SPONSOR_CAPTURE_CHECKLIST.video.map((item, index) => (
                           <CheckItem key={`suncola-video-${index}`} text={item} />
                         ))}
                       </div>
                       <div className="space-y-2">
                         <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">PHOTO</div>
                         {SPONSOR_CAPTURE_CHECKLIST.photo.map((item, index) => (
                           <CheckItem key={`suncola-photo-${index}`} text={item} />
                         ))}
                       </div>
                       <div className="space-y-2">
                         <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">GENERAL</div>
                         {SPONSOR_CAPTURE_CHECKLIST.general.map((item, index) => (
                           <CheckItem key={`suncola-general-${index}`} text={item} />
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* PEPSI GROUP */}
                 <div className="bg-black/40 border border-zinc-800/60 rounded-lg p-6 space-y-6">
                   <h4 className="text-xl font-bold text-[#FFBF00]">PEPSI GROUP</h4>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Integration Context</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Pepsi, Aquafina, Heineken under one group.</li>
                       <li>Fridges across the venue.</li>
                       <li>Fridges inside VIP boxes.</li>
                       <li>Presence across Downtown.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Website Placement</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Video → Team Relive (Set Prod) — Gallery.</li>
                       <li>Video → Video Deliverables Matrix — Supporting content block (inline media).</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Visual Direction</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Distribution and accessibility.</li>
                       <li>Fridges in real use.</li>
                       <li>VIP boxes moments.</li>
                       <li>Downtown refresh moments.</li>
                       <li>Aquafina moments feel lighter and calmer.</li>
                       <li>Heineken presence as branding/environment only (no consumption focus).</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Show Day Capture</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Fridges in real use across the venue.</li>
                       <li>VIP box service moments with fridges in frame.</li>
                       <li>Downtown refresh moments with natural flow.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Video Content (Required)</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Hero video: 60 seconds.</li>
                       <li>Cutdowns supported.</li>
                       <li>Moments: fridge access in real use, VIP box service, Downtown refresh flow.</li>
                       <li>Presence shows as infrastructure and availability (never ads).</li>
                       <li>Do not show: forced product shots, crowd posing.</li>
                     </ul>
                   </div>

                   <div className="space-y-2">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Photo Content (Required)</div>
                     <ul className="text-sm text-zinc-300 list-disc pl-4 space-y-1">
                       <li>Environmental shots: fridges in venue and VIP boxes.</li>
                       <li>Detail shots: fridge surfaces, placement, lighting.</li>
                       <li>Human interaction: natural refresh moments.</li>
                       <li>Used for website galleries, page backgrounds, and supporting visuals under text.</li>
                     </ul>
                   </div>

                   <div className="space-y-4">
                     <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Content Capture Checklist</div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="space-y-2">
                         <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">VIDEO</div>
                         {SPONSOR_CAPTURE_CHECKLIST.video.map((item, index) => (
                           <CheckItem key={`pepsi-video-${index}`} text={item} />
                         ))}
                       </div>
                       <div className="space-y-2">
                         <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">PHOTO</div>
                         {SPONSOR_CAPTURE_CHECKLIST.photo.map((item, index) => (
                           <CheckItem key={`pepsi-photo-${index}`} text={item} />
                         ))}
                       </div>
                       <div className="space-y-2">
                         <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">GENERAL</div>
                         {SPONSOR_CAPTURE_CHECKLIST.general.map((item, index) => (
                           <CheckItem key={`pepsi-general-${index}`} text={item} />
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </TabsContent>

          {/* 4. DRONE TAB */}
          <TabsContent value="drone" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             
             <UploadLinksCard />
             
             {/* DRONE FLIGHT PLANNER */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 col-span-1 md:col-span-2">
                   <CardHeader className="pb-2">
                      <CardTitle className="text-yellow-400 flex items-center gap-2"><Wind /> Flight Manifest & Safety</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-red-950/20 border border-red-900/50 rounded">
                           <h5 className="text-red-500 font-bold flex items-center gap-2 text-xs uppercase tracking-wider"><AlertTriangle size={12}/> No Fly Zones</h5>
                           <ul className="text-zinc-400 text-xs mt-2 space-y-1 list-disc pl-3">
                              <li>Directly over mainstage crowd center (unless &gt;50m alt).</li>
                              <li>Within 50m of active pyrotechnics.</li>
                              <li>Backstage artist dressing rooms.</li>
                           </ul>
                        </div>
                        <div className="p-3 bg-[#FFBF00]/20 border border-[#FFBF00]/50 rounded">
                           <h5 className="text-[#FFBF00] font-bold flex items-center gap-2 text-xs uppercase tracking-wider"><CheckSquare size={12}/> Approved Corridors</h5>
                           <ul className="text-zinc-400 text-xs mt-2 space-y-1 list-disc pl-3">
                              <li>Main access road (entry shots).</li>
                              <li>Perimeter of Mainstage (orbit shots).</li>
                              <li>Vertical ascent from FOH tower.</li>
                           </ul>
                        </div>
                      </div>
                      
                      <div className="border-t border-zinc-800 pt-4">
                         <h5 className="text-zinc-100 font-bold text-sm mb-2">Key Shot List</h5>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-400">
                            <div className="bg-black/40 p-2 rounded border border-zinc-800 flex justify-between">
                               <span>The Reveal (Low to High)</span> <Badge variant="secondary" className="text-[10px] h-5">Sunset</Badge>
                            </div>
                            <div className="bg-black/40 p-2 rounded border border-zinc-800 flex justify-between">
                               <span>The Chase (Follow Artist Car)</span> <Badge variant="secondary" className="text-[10px] h-5">Arrival</Badge>
                            </div>
                            <div className="bg-black/40 p-2 rounded border border-zinc-800 flex justify-between">
                               <span>God's Eye (Top Down)</span> <Badge variant="secondary" className="text-[10px] h-5">Peak Hour</Badge>
                            </div>
                            <div className="bg-black/40 p-2 rounded border border-zinc-800 flex justify-between">
                               <span>Laser Cut (Through Beams)</span> <Badge variant="secondary" className="text-[10px] h-5">Night</Badge>
                            </div>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                {/* DRONE TECH SPECS */}
                <div className="space-y-4">
                   <TechSpecCard 
                      title="Drone Specs"
                      icon={<Plane className="text-cyan-400" />}
                      specs={[
                        "FPV: 4K 60fps (Stabilized)",
                        "Mavic/Cinema: 5.1K ProRes",
                        "ND Filters: Mandatory (maintain 180° shutter)",
                        "Spotter: Always required."
                      ]}
                   />
                </div>
             </div>

             <BriefSection 
               mood="cyber"
               title="Air Support Unit"
               role="Sky Team"
               image="https://images.unsplash.com/photo-1567215518282-e89662aad049?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
               description="The Eye in the Sky. Show us the scale."
               responsibilities={[
                 "Feb 1-2: Pre-flight checks and site mapping. Find the 'No Fly Zones'.",
                 "Weekend 1: Focus on crowd density and stage pyro shots.",
                 "Weekend 2: Focus on sunset transitions and light shows.",
                 "Reveal shots: Starting low behind a stage and rising to reveal the crowd."
               ]}
               deliverables={[
                 "4K 60fps Log footage.",
                 "High-res DNG photos of the full site (Day & Night).",
                 "Uncut long takes for background video use."
               ]}
               notes="SAFETY: Do not fly over crowds at low altitude. Use zoom. If wind > 20km/h, ground the bird."
             />
          </TabsContent>

          {/* 5. SOCIAL & MOTION TAB */}
          <TabsContent value="smm" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <UploadLinksCard />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2"><Share2 /> SMM Strategy (TEA)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-900/10 border border-blue-900/50 rounded">
                    <h4 className="font-bold text-blue-200">The 30-Minute Rule</h4>
                    <p className="text-sm text-zinc-400">Every 30 minutes, the story must be updated. No dead air.</p>
                  </div>
                  <ul className="space-y-2 text-zinc-300 text-sm list-disc pl-4">
                    <li>Feb 3 (Pre-party): Tease the venue. "Almost ready".</li>
                    <li>Weekend 1: "FOMO" generation. "You should be here".</li>
                    <li>The Gap (Feb 7-11): Recap highlights, Artist thank yous, Hype for Wk2.</li>
                    <li>Weekend 2: "Last Chance" messaging.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2"><Aperture /> Motion Design</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-purple-900/10 border border-purple-900/50 rounded">
                    <h4 className="font-bold text-purple-200">Asset Pack</h4>
                    <p className="text-sm text-zinc-400">Use the provided 'Glitch Pack V2' for all overlays.</p>
                  </div>
                  <ul className="space-y-2 text-zinc-300 text-sm list-disc pl-4">
                    <li>Animated Logos for intro/outro.</li>
                    <li>"Live Now" overlays for stories.</li>
                    <li>Artist Name lower-thirds (Cyber style).</li>
                    <li>Countdown timers for headliners.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-[#FFBF00]">Social Run of Show — Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-3 bg-[#FFBF00]/10 border border-[#FFBF00]/30 rounded">
                  <h4 className="font-bold text-[#FFBF00]">Format Rules</h4>
                  <ul className="text-sm text-zinc-300 list-disc pl-4 mt-2 space-y-1">
                    <li>Story = live pulse. Use for doors, movement, and quick transitions.</li>
                    <li>Social post = curated selects. Use for hero moments and space identity.</li>
                    <li>Reel = 60s hero video with clear arc. Cutdowns supported.</li>
                  </ul>
                </div>

                {SOCIAL_RUN_OF_SHOW.map((day) => (
                  <div key={day.day} className="space-y-3">
                    <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">{day.day}</div>
                    <div className="space-y-3">
                      {day.entries.map((entry, index) => (
                        <div
                          key={`${day.day}-${index}`}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-black/40 border border-zinc-800/60 rounded-lg p-4"
                        >
                          <div className="md:col-span-2 text-xs font-mono text-zinc-400">{entry.time}</div>
                          <div className="md:col-span-2 text-xs font-bold uppercase tracking-wider text-zinc-200">{entry.format}</div>
                          <div className="md:col-span-4 text-sm text-zinc-300">{entry.capture}</div>
                          <div className="md:col-span-4 text-sm text-zinc-400">Caption: {entry.caption}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 6. CHECKLIST TAB */}
          <TabsContent value="checklist" className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <UploadLinksCard />
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-[#FFBF00]">Master Production Checklist</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-4">
                     <h4 className="font-bold text-white border-b border-zinc-800 pb-2">PRE-EVENT (FEB 1-4)</h4>
                     <CheckItem text="Permits Cleared (Drone)" />
                     <CheckItem text="Media Passes Distributed" />
                     <CheckItem text="Hard Drives Formatted (x10)" />
                     <CheckItem text="Lanyards 'No Photo' Printed" />
                     <CheckItem text="Briefing Meeting Scheduled" />
                   </div>
                   <div className="space-y-4">
                     <h4 className="font-bold text-white border-b border-zinc-800 pb-2">LIVE OPS (WEEKENDS)</h4>
                     <CheckItem text="Radio Channel Sync" />
                     <CheckItem text="Ring Lights Charged" />
                     <CheckItem text="Mic Cams Mounted" />
                     <CheckItem text="Internet Speed Test" />
                     <CheckItem text="Totem Placed at Entrance" />
                   </div>
                   <div className="space-y-4">
                     <h4 className="font-bold text-white border-b border-zinc-800 pb-2">POST-EVENT (FEB 14+)</h4>
                     <CheckItem text="SD Card Dump (Double Backup)" />
                     <CheckItem text="Equipment Count/Return" />
                     <CheckItem text="Final Aftermovie Upload" />
                     <CheckItem text="Artist Content Sent" />
                   </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Photography Coverage Checklist</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PHOTO_CHECKLIST_SECTIONS.map((section, index) => (
                    <CheckSection key={index} title={section.title} items={section.items} />
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-purple-400">Videography Coverage Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {VIDEO_CHECKLIST_ITEMS.map((item, index) => (
                    <CheckItem key={index} text={item} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
        
        {/* FOOTER */}
        <footer className="mt-20 border-t border-zinc-900 pt-8 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
           <p>Freaks of Nature Production | Confidential | Do not distribute</p>
           <p className="mt-2 text-zinc-800">System v7.0.1 // Live</p>
        </footer>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

function TabTrigger({ value, icon, label }: { value: string, icon: React.ReactNode, label: string }) {
  return (
    <TabsTrigger 
      value={value} 
      className="data-[state=active]:bg-zinc-100 data-[state=active]:text-black text-zinc-400 px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 hover:text-white"
    >
      {icon}
      <span className="hidden md:inline font-bold uppercase text-xs tracking-wider">{label}</span>
    </TabsTrigger>
  );
}

function StatCard({ label, value, sub, color }: { label: string, value: string, sub: string, color: 'cyan' | 'pink' }) {
  const colorClasses = {
    cyan: "text-cyan-400 border-cyan-900/50 bg-cyan-950/20",
    pink: "text-pink-400 border-pink-900/50 bg-pink-950/20"
  };
  
  return (
    <div className={cn("border p-4 rounded-xl", colorClasses[color])}>
      <div className="text-3xl font-black">{value}</div>
      <div className="font-bold uppercase text-xs opacity-80">{label}</div>
      <div className="text-xs opacity-50 mt-1 font-mono">{sub}</div>
    </div>
  );
}

function TeamMember({ name, role, icon, color, contact, note }: { name: string, role: string, icon: string, color: string, contact?: string, note?: string }) {
  const whatsappNumber = contact ? contact.replace(/\D/g, '') : '';
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '';
  return (
    <div className="flex items-center gap-4 bg-black/40 p-3 rounded border border-zinc-800/50 hover:border-zinc-700 transition-colors">
      <div className="text-2xl bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-full border border-zinc-800">
        {icon}
      </div>
      <div>
        <div className={cn("font-bold text-lg", color)}>{name}</div>
        <div className="text-zinc-500 text-xs uppercase tracking-wider">{role}</div>
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 rounded-md border border-[#FFBF00]/60 bg-[#FFBF00]/40 text-[#FFBF00] text-[11px] font-mono uppercase tracking-wider hover:border-[#FFBF00] hover:text-[#FFBF00] transition-colors"
          >
            WhatsApp
          </a>
        ) : null}
        {note ? (
          <div className="text-red-400 text-[10px] uppercase tracking-wider mt-1">{note}</div>
        ) : null}
      </div>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <Checkbox className="border-zinc-600 data-[state=checked]:bg-[#FFBF00] data-[state=checked]:border-[#FFBF00] text-black" />
      <span className="text-zinc-400 text-sm group-hover:text-[#FFBF00] transition-colors">{text}</span>
    </div>
  );
}

function CheckSection({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="space-y-3">
      <h4 className="font-bold text-white border-b border-zinc-800 pb-2">{title}</h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <CheckItem key={index} text={item} />
        ))}
      </div>
    </div>
  );
}

function InfoCard({ title, icon, content }: { title: string, icon: React.ReactNode, content: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 hover:border-zinc-600 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-bold text-zinc-100">{title}</h3>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">
        {content}
      </p>
    </div>
  );
}

function TechSpecCard({ title, icon, specs }: { title: string, icon: React.ReactNode, specs: string[] }) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-lg">
      <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-3">
        {icon}
        <h3 className="font-bold text-zinc-100 uppercase tracking-wide text-sm">{title}</h3>
      </div>
      <ul className="space-y-2">
        {specs.map((spec, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
            <span className="mt-1 w-1 h-1 bg-zinc-600 rounded-full shrink-0" />
            {spec}
          </li>
        ))}
      </ul>
    </div>
  );
}
