import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { BriefSection } from "./components/briefs/BriefSection";
import { GlitchHeader } from "./components/ui/GlitchHeader";
import { ScheduleTimeline } from "./components/briefs/ScheduleTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { Badge } from "./components/ui/badge";
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

export default function App() {
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
             <MasterPlanBoard />
          </TabsContent>

          {/* 0.6 PRODUCTION MATRIX TAB (NEW) */}
          <TabsContent value="matrix" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <ProductionMatrix />
          </TabsContent>

          {/* 1. OVERVIEW / MISSION TAB */}
          <TabsContent value="overview" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
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
             
             {/* TECHNICAL SPECS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TechSpecCard 
                  title="File Protocols" 
                  icon={<FileDigit className="text-cyan-400" />}
                  specs={[
                    "Format: RAW + JPG (Fine)",
                    "Color Space: sRGB (for immediate social export)",
                    "Naming: YYYYMMDD_STAGE_PHOTOGRAPHER_001.ARW"
                  ]}
                />
                <TechSpecCard 
                  title="Gear Essentials" 
                  icon={<Settings className="text-[#FFBF00]" />}
                  specs={[
                    "Fast Glass: f/2.8 or faster mandatory.",
                    "On-camera flash: ONLY for crowd portraits (Rear-curtain sync).",
                    "No flash for stage acts unless authorized.",
                    "Battery grip recommended for 10hr+ shifts."
                  ]}
                />
             </div>

             {/* PHASE 1 */}
             <div className="space-y-2">
                <Badge variant="outline" className="border-cyan-500 text-cyan-500">PHASE 1: THE WARM UP (FEB 1-4)</Badge>
                <BriefSection 
                  mood="cyber"
                  title="Pre-Party & Prep"
                  role="Atmosphere"
                  description="Setting the scene. Empty venue shots, construction time-lapses, and the exclusive Feb 3rd Pre-Party."
                  responsibilities={[
                    "Feb 1-2: Capture 'Work in Progress' shots. Sparks flying, sound/light tests.",
                    "Feb 3 (Pre-Party): Low light mastery. Capture the 'Inner Circle' vibe. No flash if possible.",
                    "Feb 4: Artist arrivals. Soundcheck portraits (Black & White style)."
                  ]}
                  deliverables={[
                    "10x 'Hype' photos for stories (Vertical) per day.",
                    "50x High-quality Pre-party selects.",
                  ]}
                />
             </div>

             {/* PHASE 2 */}
             <div className="space-y-2">
                <Badge variant="outline" className="border-[#FFBF00] text-[#FFBF00]">PHASE 2: WEEKEND 1 (FEB 5-6)</Badge>
                   <BriefSection 
                     mood="toxic"
                     title="Team Tarik: The Memzo Ops"
                     role="Engagement Unit"
                     description="Capture. Connect. Upload. Every face matters."
                   responsibilities={[
                     "Use Ring Lights aggressively. Even in daytime if needed for that 'studio' look.",
                     "Guide attendees to Activation Screens. 'Check your photo now!'",
                     "Shoot vertical + horizontal options.",
                     "HYPE THEM UP. You are not just a photographer, you are an entertainer."
                   ]}
                   deliverables={[
                     "Continuous upload stream to Memzo.ai.",
                     "Min 500+ usable attendee portraits per day.",
                     "Zero blurry shots. High shutter speed is your friend."
                   ]}
                   notes="If the internet lags, keep shooting and bulk upload when stable. Do not stop the flow."
                 />
                 <BriefSection 
                   mood="neon"
                   title="Editorial & Stage"
                   role="Artistic Unit"
                   responsibilities={[
                     "Hero moments: Confetti, Pyro, Drops.",
                     "Silhouette shots against the massive LED screens.",
                     "Detail shots: Food, Fashion, Decor, Mud, Boots, Hands.",
                   ]}
                   deliverables={[
                     "Top 20 'Bangers' delivered within 2 hours of gates open.",
                     "Full gallery (Edited) by 10 AM next day.",
                   ]}
                 />
             </div>

             {/* PHASE 3 */}
             <div className="space-y-2">
                <Badge variant="outline" className="border-pink-500 text-pink-500">PHASE 3: WEEKEND 2 (FEB 12-13)</Badge>
                <BriefSection 
                  mood="cyber"
                  title="The Grand Finale"
                  role="Legacy"
                  description="The final push. We know the lighting cues now. We know the crowd. Get the shots we missed."
                  responsibilities={[
                    "Capture the 'Exhausted but Happy' emotion.",
                    "More interaction shots between strangers.",
                    "The Final Closing Ceremony - this is the money shot."
                  ]}
                  deliverables={[
                    "Best of Festival Collection (Top 50 All-time).",
                  ]}
                />
             </div>
          </TabsContent>

          {/* 3. VIDEO TAB */}
          <TabsContent value="video" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             
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
          </TabsContent>

          {/* 4. DRONE TAB */}
          <TabsContent value="drone" className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             
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
          </TabsContent>

          {/* 6. CHECKLIST TAB */}
          <TabsContent value="checklist" className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
           <p className="mt-2 text-zinc-800">System v7.0.1 // Connected to Memzo.ai</p>
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
