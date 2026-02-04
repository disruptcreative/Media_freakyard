import React, { useState } from 'react';
import { Badge } from "../ui/badge";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Camera, Video, Share2, ShieldAlert, Zap, Skull, Eye, 
  MapPin, Clock, Calendar, AlertTriangle, CheckCircle2, 
  User, Plus, Users, Aperture, Plane, ListChecks, ChevronRight, X, Disc,
  Crown, ShoppingBag, Utensils, Sparkles
} from 'lucide-react';
import { cn } from "../../lib/utils";

// --- TYPES & DATA ---

type TeamType = 'photo' | 'video' | 'social' | 'drone' | 'mgmt' | 'broadcast';

interface Shift {
  id: string;
  timeStart: number; // Hour 0-23 (supports minutes via decimals)
  duration: number; // Hours (supports fractions)
  task: string;
  crew: string[];
  type: TeamType;
  priority: 'normal' | 'high' | 'critical';
  shotCategories?: string[]; // IDs of shot categories covered
  artist?: string;
}

interface DaySchedule {
  date: string;
  label: string;
  shifts: Record<string, Shift[]>; // Key is Location ID
}

interface ShotCategory {
  id: string;
  title: string;
  items: string[];
}

const LOCATIONS = [
  { id: 'main', name: 'Freak Stage (Main)', icon: <Zap size={14} className="text-[#FFBF00]"/> },
  { id: 'under', name: 'Underground', icon: <Skull size={14} className="text-purple-400"/> },
  { id: 'hof', name: 'House of Freaks', icon: <Eye size={14} className="text-pink-400"/> },
  { id: 'hub', name: 'Entrance / Plaza', icon: <MapPin size={14} className="text-yellow-400"/> },
  { id: 'site', name: 'Site / Infra', icon: <Plane size={14} className="text-sky-400"/> },
  { id: 'activations', name: 'Activations / Art', icon: <Sparkles size={14} className="text-orange-400"/> },
  { id: 'merch', name: 'Merch', icon: <ShoppingBag size={14} className="text-amber-400"/> },
  { id: 'food', name: 'Food / Bar', icon: <Utensils size={14} className="text-[#FFBF00]"/> },
  { id: 'vip', name: 'VIP', icon: <Crown size={14} className="text-yellow-300"/> },
  { id: 'hq', name: 'Backstage / HQ', icon: <ShieldAlert size={14} className="text-blue-400"/> },
];

// Extended hours to cover build days and late nights (09:00 to 05:00)
const DAY_START = 9;
const SLOT_HOURS = 0.5;
const HOURS = [
  ...Array.from({ length: Math.round((24 - DAY_START) / SLOT_HOURS) }, (_, i) => DAY_START + (i * SLOT_HOURS)),
  ...Array.from({ length: Math.round(5 / SLOT_HOURS) + 1 }, (_, i) => i * SLOT_HOURS),
];
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
const MIN_DISPLAY_DURATION = 0.1;
const hm = (h: number, m: number = 0) => h + (m / MINUTES_PER_HOUR);
const dur = (startH: number, startM: number, endH: number, endM: number) => {
  const start = startH * MINUTES_PER_HOUR + startM;
  const end = endH * MINUTES_PER_HOUR + endM;
  const adjustedEnd = end < start ? end + MINUTES_PER_DAY : end;
  return (adjustedEnd - start) / MINUTES_PER_HOUR;
};
const formatTime = (hour: number) => {
  const totalMinutes = ((Math.round(hour * MINUTES_PER_HOUR) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const m = totalMinutes % MINUTES_PER_HOUR;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// --- MASTER SHOT LIST DATA ---
const SHOT_LIST: Record<string, ShotCategory> = {
  'dj_set': {
    id: 'dj_set', title: 'DJ Set Coverage (Full)',
    items: [
      'FULL SET RECORDING (Tripod/Static)',
      'Intros & Outros',
      'Crowd reaction (Drops)',
      'DJ hands / mixer close-ups',
      'Pyro / CO2 moments',
      'Behind the decks POV',
      'Stage lighting wide shots'
    ]
  },
  'site': {
    id: 'site', title: 'Site / Location / Infrastructure',
    items: [
      'Full site aerial (empty)',
      'Full site aerial (live)',
      'Site perimeter',
      'Site skyline',
      'Site signage from distance',
      'Entry gates (front)',
      'Entry gates (branding close-up)',
      'Queue formations',
      'Crowd flow lanes',
      'Ground markings',
      'Path lighting',
      'Site maps installed',
      'Fence branding',
      'Cranes / industrial elements',
      'Cabling runs (clean)',
      'Flooring types',
      'Ramps and accessibility paths'
    ]
  },
  'arrival': {
    id: 'arrival', title: 'Arrival / Entry Experience',
    items: [
      'Ticket scanning devices',
      'Wristband application',
      'Security checks',
      'Bag check tables',
      'Welcome staff',
      'Host gestures',
      'First crowd reactions',
      'Arrival outfits',
      'Entry lighting mood',
      'Entry soundscape elements'
    ]
  },
  'branding': {
    id: 'branding', title: 'Branding & Graphic System',
    items: [
      'Freaks of Nature logo applications',
      'Event title signage',
      'Typography close-ups',
      'Wayfinding signs',
      'Directional arrows',
      'Zone labels',
      'Safety signage',
      'Schedule boards',
      'Digital screens (static)',
      'Digital screens (motion)',
      'Co-branded panels',
      'Wall graphics',
      'Floor graphics',
      'Stickers',
      'Stencils',
      'Temporary prints'
    ]
  },
  'id': {
    id: 'id', title: 'Wristbands / Passes / ID',
    items: [
      'GA wristbands (flat)',
      'GA wristbands (worn)',
      'VIP wristbands',
      'Golden Circle wristbands',
      'Staff wristbands',
      'Media wristbands',
      'Artist wristbands',
      'Lanyards (flat)',
      'Lanyards (worn)',
      'Staff badges',
      'Media badges',
      'Artist badges',
      'VIP passes',
      'Backstage passes',
      'Credential scanning moments'
    ]
  },
  'consent': {
    id: 'consent', title: 'Consent & Safety',
    items: [
      'Opt-out lanyards',
      'Opt-out totems',
      'Consent signage',
      'Consent signage in crowd context',
      'Security staff interaction',
      'Medical tents',
      'First aid signage',
      'Fire safety equipment',
      'Crowd control barriers',
      'Calm intervention moments'
    ]
  },
  'crowd': {
    id: 'crowd', title: 'Crowd / Audience',
    items: [
      'Crowd wide shots',
      'Mid-density crowd shots',
      'Close crowd portraits',
      'Groups of friends',
      'Couples',
      'Solo attendees',
      'Dancing feet',
      'Hands in air',
      'Hands holding phones',
      'Sunglasses at night',
      'Fashion details',
      'Accessories',
      'Makeup',
      'Hairstyles',
      'Reactions to drops',
      'Quiet moments',
      'Resting moments',
      'Walking between stages'
    ]
  },
  'mainstage': {
    id: 'mainstage', title: 'Mainstage',
    items: [
      'Mainstage wide (empty)',
      'Mainstage wide (crowded)',
      'Mainstage frontal',
      'Mainstage angled',
      'Stage depth shots',
      'Stage layers',
      'LED content close-ups',
      'Lighting rigs',
      'Truss details',
      'Pyro hardware',
      'Smoke effects',
      'DJ booth exterior',
      'DJ booth interior',
      'Crowd from stage POV',
      'Stage from crowd POV',
      'Peak moment wide',
      'Closing moment wide'
    ]
  },
  'underground': {
    id: 'underground', title: 'Underground Stage',
    items: [
      'Exterior entrance',
      'Queue to entrance',
      'Interior wide',
      'Ceiling structures',
      'Mapping surfaces',
      'Lighting effects',
      'DJ booth',
      'Crowd density',
      'Crowd silhouettes',
      'Sweat / movement close-ups',
      'Immersive angles',
      'Exit corridor'
    ]
  },
  'hof': {
    id: 'hof', title: 'House of Freaks',
    items: [
      'Exterior facade',
      'LED windows',
      'Freak Squad animations',
      'Interior wide',
      'Furniture details',
      'Props',
      'Scenic textures',
      'Lighting mood',
      'Crowd interaction',
      'Playful moments',
      'Performer reactions'
    ]
  },
  'popup': {
    id: 'popup', title: 'Pop-up Stages',
    items: [
      'Full stage wide',
      'Branding elements',
      'Sponsor logos',
      'DJ booth',
      'Crowd interaction',
      'Lighting setups',
      'Stage at night',
      'Stage in transition'
    ]
  },
  'art': {
    id: 'art', title: 'Art Installations',
    items: [
      'Installation wide',
      'Installation close-ups',
      'Materials',
      'Interaction moments',
      'Night lighting',
      'People engaging',
      'Motion elements',
      'Abstract angles'
    ]
  },
  'sponsor': {
    id: 'sponsor', title: 'Sponsor Activations',
    items: [
      'Activation exterior',
      'Activation interior',
      'Branding panels',
      'Product displays',
      'Staff uniforms',
      'Guest interaction',
      'Night lighting version',
      'Close-up logos',
      'Product-in-hand moments',
      'Queue moments'
    ]
  },
  'bar': {
    id: 'bar', title: 'Bar Program',
    items: [
      'Bar exterior wide',
      'Bar signage',
      'Menu boards',
      'Countertops',
      'Bar tools',
      'Ice bins',
      'Drink preparation',
      'Staff uniforms',
      'Payment moments',
      'Queue flow',
      'Night lighting',
      'Empty bar (pre-open)',
      'Active bar (peak)'
    ]
  },
  'food': {
    id: 'food', title: 'Food & Catering',
    items: [
      'Food stall exterior',
      'Interior prep',
      'Packaging',
      'Menu signage',
      'Serving moments',
      'Guest reactions',
      'Seating areas',
      'Trash management stations'
    ]
  },
  'vip': {
    id: 'vip', title: 'VIP - General',
    items: [
      'VIP entrance',
      'VIP signage',
      'Access control',
      'Lounge wide (empty)',
      'Lounge wide (live)',
      'Seating layouts',
      'Decorative elements',
      'Lighting design',
      'Crowd comfort moments'
    ]
  },
  'vip_boxes': {
    id: 'vip_boxes', title: 'VIP Boxes (Each Box)',
    items: [
      'Box exterior',
      'Box interior wide',
      'Seating close-ups',
      'Tables',
      'Railings',
      'Flooring',
      'Lighting fixtures',
      'Branding plaques',
      'View to stage',
      'View from stage',
      'Box with guests',
      'Service moments',
      'Staff interaction',
      'Night mood shot'
    ]
  },
  'vip_service': {
    id: 'vip_service', title: 'VIP Service',
    items: [
      'Hosts greeting guests',
      'Tray service',
      'Table service',
      'Guest reactions',
      'Calm conversations',
      'Premium atmosphere'
    ]
  },
  'backstage': {
    id: 'backstage', title: 'Backstage / Operations',
    items: [
      'Artist arrival',
      'Artist transport',
      'Backstage corridors',
      'Production offices',
      'FOH control desks',
      'Lighting consoles',
      'Sound consoles',
      'Radio communication',
      'Crew coordination',
      'Load-in activity',
      'Load-out activity'
    ]
  },
  'merch': {
    id: 'merch', title: 'Merch / Retail',
    items: [
      'Merch booth exterior',
      'Merch booth interior',
      'Product flat-lays',
      'Apparel close-ups',
      'Tags and labels',
      'Payment moments',
      'People wearing merch',
      'Models wearing merch',
      'Display tables'
    ]
  },
  'atmos': {
    id: 'atmos', title: 'Transitions & Atmosphere',
    items: [
      'Sunset over site',
      'Blue hour lighting',
      'Fog / haze',
      'Light beams in air',
      'Crowd silhouettes',
      'Long exposure motion',
      'Reflections on metal'
    ]
  },
  'closing': {
    id: 'closing', title: 'Closing & After',
    items: [
      'Final set crowd',
      'Closing reactions',
      'People leaving',
      'Exit lighting',
      'Empty stages',
      'Empty VIP',
      'Empty bars',
      'Empty site at dawn'
    ]
  },
  'bts': {
    id: 'bts', title: 'Behind The Scenes / Build',
    items: [
      'Build crew at work',
      'Timelapse: stage build / site rig',
      'Rigging, lighting focus, sound checks',
      'Production offices and comms',
      'Gear prep and data wrangling',
      'Team huddles / briefings',
      'Load-in / load-out activity'
    ]
  }
};

// CREW ROSTER
const CREW_ROSTER = {
  broadcast: [
     { id: 'B1', role: 'Stream Lead' },
     { id: 'B2', role: 'Cam 1 (Front)' },
     { id: 'B3', role: 'Cam 2 (Jib)' },
     { id: 'B4', role: 'Cam 3 (Stage)' },
  ],
  photo: [
    { id: 'P1', role: 'Photo Lead' },
    { id: 'P2', role: 'Photo Main' },
    { id: 'P3', role: 'Photo Under' },
    { id: 'P4', role: 'Photo HOF' },
    { id: 'P5', role: 'Photo Roam' },
  ],
  video: [
    { id: 'V1', role: 'Video Dir' },
    { id: 'V2', role: 'Cam A (Gimbal)' },
    { id: 'V3', role: 'Cam B (Long)' },
    { id: 'V4', role: 'Cam C (POV)' },
    { id: 'V5', role: 'Video Socials' },
  ],
  drone: [
    { id: 'D1', role: 'Drone FPV' },
    { id: 'D2', role: 'Drone Cinema' },
  ],
  social: [
    { id: 'S1', role: 'Social Lead' },
    { id: 'S2', role: 'Editor 1' },
    { id: 'S3', role: 'Editor 2' },
  ],
  mgmt: [
    { id: 'M1', role: 'Prod Mgr' },
    { id: 'M2', role: 'Runner 1' },
    { id: 'M3', role: 'Runner 2' },
  ]
};

const TEAM_KEYS: TeamType[] = ['broadcast', 'photo', 'video', 'drone', 'social', 'mgmt'];

const CREW_ID_TO_TEAM = Object.entries(CREW_ROSTER).reduce((acc, [team, members]) => {
  members.forEach((member) => {
    acc[member.id] = team as TeamType;
  });
  return acc;
}, {} as Record<string, TeamType>);

const getCrewTeamCounts = (crew: string[]) => {
  const counts: Record<TeamType, number> = {
    broadcast: 0,
    photo: 0,
    video: 0,
    drone: 0,
    social: 0,
    mgmt: 0
  };

  crew.forEach((member) => {
    const tokens = member.split(' ');
    const code = tokens[0];
    if (code === 'ALL') {
      const modifier = tokens.slice(1).join(' ').toUpperCase();
      if (modifier.includes('VIDEO')) {
        counts.video += CREW_ROSTER.video.length;
        return;
      }
      if (modifier.includes('MGMT')) {
        counts.mgmt += CREW_ROSTER.mgmt.length;
        return;
      }
      if (modifier.includes('LEADS')) {
        TEAM_KEYS.forEach((team) => {
          counts[team] += 1;
        });
        return;
      }
      if (modifier.includes('CREW') || modifier.includes('UNITS')) {
        TEAM_KEYS.forEach((team) => {
          counts[team] += CREW_ROSTER[team].length;
        });
        return;
      }
      return;
    }
    const team = CREW_ID_TO_TEAM[code];
    if (team) {
      counts[team] += 1;
    }
  });

  return counts;
};

// INITIAL SCHEDULE POPULATED WITH DELIVERABLES
const INITIAL_SCHEDULE: Record<string, DaySchedule> = {
  'build': {
    date: 'Feb 01-02',
    label: 'PREP: Build Phase',
    shifts: {
      'main': [
        { id: 'bmain1', timeStart: 9, duration: 3, task: 'Build Timelapse: Mainstage Structure', crew: ['V2 (Gimbal)', 'D2 (Cinema)'], type: 'video', priority: 'high', shotCategories: ['bts', 'mainstage', 'site'] },
        { id: 'bmain2', timeStart: 12, duration: 2, task: 'LED Wall + Lighting Focus Tests', crew: ['V3 (Long)', 'P2 (Main)'], type: 'video', priority: 'normal', shotCategories: ['mainstage', 'bts'] },
        { id: 'bmain3', timeStart: 14, duration: 3, task: 'Stage Detail Stills + Pyro Hardware', crew: ['P2 (Main)'], type: 'photo', priority: 'normal', shotCategories: ['mainstage'] },
        { id: 'bmain4', timeStart: 17, duration: 1, task: 'Empty Stage Wides (Golden Hour)', crew: ['P2 (Main)', 'D2 (Cinema)'], type: 'photo', priority: 'high', shotCategories: ['mainstage', 'atmos'] },
      ],
      'under': [
        { id: 'bund1', timeStart: 10, duration: 3, task: 'Underground Build + Mapping Surfaces', crew: ['V4 (POV)', 'P3 (Under)'], type: 'video', priority: 'normal', shotCategories: ['underground', 'bts'] },
        { id: 'bund2', timeStart: 13, duration: 2, task: 'Lighting Tests + Texture Stills', crew: ['P3 (Under)'], type: 'photo', priority: 'normal', shotCategories: ['underground'] },
      ],
      'hof': [
        { id: 'bhof1', timeStart: 11, duration: 3, task: 'Scenic Install + Props', crew: ['P4 (HOF)', 'V5 (Socials)'], type: 'photo', priority: 'normal', shotCategories: ['hof', 'bts'] },
        { id: 'bhof2', timeStart: 15, duration: 2, task: 'Freak Squad Animations Test', crew: ['V5 (Socials)'], type: 'social', priority: 'normal', shotCategories: ['hof', 'branding'] },
      ],
      'hub': [
        { id: 'bhub1', timeStart: 12, duration: 2, task: 'Entry Gates Build + Signage Install', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['site', 'branding', 'arrival'] },
        { id: 'bhub2', timeStart: 14, duration: 2, task: 'Queue Barriers + Flow Lanes', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['site'] },
      ],
      'site': [
        { id: 'bsite1', timeStart: 9, duration: 3, task: 'Site Aerials (Empty) + Perimeter', crew: ['D1 (FPV)'], type: 'drone', priority: 'high', shotCategories: ['site'] },
        { id: 'bsite2', timeStart: 12, duration: 3, task: 'Infrastructure Sweep (Cabling/Paths)', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['site'] },
        { id: 'bsite3', timeStart: 15, duration: 2, task: 'Wayfinding + Map Installs', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['site', 'branding'] },
      ],
      'activations': [
        { id: 'bact1', timeStart: 13, duration: 3, task: 'Sponsor Activation Build', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['sponsor', 'branding', 'popup'] },
        { id: 'bact2', timeStart: 16, duration: 2, task: 'Art Installations (Setup)', crew: ['V5 (Socials)'], type: 'social', priority: 'normal', shotCategories: ['art', 'bts'] },
      ],
      'merch': [
        { id: 'bmer1', timeStart: 14, duration: 2, task: 'Merch Booth Setup + Flat-lays', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['merch'] },
      ],
      'food': [
        { id: 'bfood1', timeStart: 14, duration: 2, task: 'Food Stall Setup + Menu Boards', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['food', 'bar', 'branding'] },
      ],
      'vip': [
        { id: 'bvip1', timeStart: 15, duration: 2, task: 'VIP Lounge Build + Decor', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['vip', 'vip_boxes'] },
      ],
      'hq': [
        { id: 'bhq1', timeStart: 9, duration: 1, task: 'Build Briefing + Safety', crew: ['ALL LEADS'], type: 'mgmt', priority: 'high', shotCategories: ['bts'] },
        { id: 'bhq2', timeStart: 12, duration: 1, task: 'Media Drives + Ingest Station Setup', crew: ['M1 (Mgr)'], type: 'mgmt', priority: 'normal', shotCategories: ['backstage'] },
        { id: 'bhq3', timeStart: 17, duration: 1, task: 'Build Day Backup', crew: ['M1 (Mgr)', 'S2 (Editor)'], type: 'mgmt', priority: 'high', shotCategories: ['backstage'] },
      ],
    }
  },
  'preparty': {
    date: 'Feb 03',
    label: 'PRE-PARTY: Influencer Night',
    shifts: {
      'main': [
        { id: 'ppmain1', timeStart: 20, duration: 2, task: 'Pre-Party Stage Warmup + Atmos', crew: ['V2 (Gimbal)', 'P2 (Main)'], type: 'video', priority: 'high', shotCategories: ['mainstage', 'atmos'] },
        { id: 'ppmain2', timeStart: 22, duration: 2, task: 'Pre-Party Highlights Set 1', crew: ['V2 (Gimbal)', 'P2 (Main)'], type: 'video', priority: 'high', shotCategories: ['dj_set', 'crowd', 'mainstage'] },
        { id: 'ppmain3', timeStart: 0, duration: 2, task: 'Pre-Party Peak Moments', crew: ['V3 (Long)', 'P2 (Main)'], type: 'video', priority: 'critical', shotCategories: ['dj_set', 'crowd', 'mainstage'] },
      ],
      'hof': [
        { id: 'pphof1', timeStart: 21, duration: 2, task: 'House of Freaks Party Coverage', crew: ['P4 (HOF)', 'V5 (Socials)'], type: 'photo', priority: 'normal', shotCategories: ['hof', 'crowd'] },
        { id: 'pphof2', timeStart: 23, duration: 2, task: 'Performer Moments + Reactions', crew: ['P4 (HOF)'], type: 'photo', priority: 'normal', shotCategories: ['hof', 'crowd'] },
      ],
      'hub': [
        { id: 'pphub1', timeStart: 20, duration: 2, task: 'Influencer Arrivals + Wristbands', crew: ['P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['arrival', 'id', 'consent'] },
        { id: 'pphub2', timeStart: 22, duration: 1, task: 'Entry Mood + First Reactions', crew: ['V5 (Socials)'], type: 'social', priority: 'normal', shotCategories: ['arrival', 'crowd'] },
      ],
      'site': [
        { id: 'ppsite1', timeStart: 20, duration: 2, task: 'Night Exterior + Skyline', crew: ['D2 (Cinema)'], type: 'drone', priority: 'normal', shotCategories: ['site', 'atmos'] },
      ],
      'activations': [
        { id: 'ppact1', timeStart: 21, duration: 2, task: 'Sponsor Cocktail Activations', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['sponsor', 'branding', 'crowd'] },
      ],
      'merch': [
        { id: 'ppmer1', timeStart: 20, duration: 2, task: 'Merch Preview + Models', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['merch', 'crowd'] },
      ],
      'food': [
        { id: 'ppfood1', timeStart: 20, duration: 2, task: 'Bar Program + Signature Drinks', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'food'] },
      ],
      'vip': [
        { id: 'ppvip1', timeStart: 22, duration: 2, task: 'VIP Lounge + Boxes (Pre-Party)', crew: ['P1 (Lead)'], type: 'photo', priority: 'high', shotCategories: ['vip', 'vip_boxes', 'vip_service'] },
      ],
      'hq': [
        { id: 'pphq1', timeStart: 19, duration: 1, task: 'Pre-Party Briefing', crew: ['ALL LEADS'], type: 'mgmt', priority: 'high', shotCategories: ['bts'] },
        { id: 'pphq2', timeStart: 23, duration: 2, task: 'Live Edit: Pre-Party Aftermovie', crew: ['S1 (Lead)', 'S2 (Editor)'], type: 'social', priority: 'critical', shotCategories: ['branding'] },
        { id: 'pphq3', timeStart: 2, duration: 1, task: 'Data Backup + Wrap', crew: ['M1 (Mgr)'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
      ],
    }
  },
  'wk1_thu': {
    date: 'Thu Feb 5',
    label: 'WK1: Thursday (Full)',
    shifts: {
      'main': [
        { id: 'wk1_thu_main_1', timeStart: hm(17, 40), duration: dur(17, 40, 18, 10), task: 'Prayer Time', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_thu_main_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_thu_main_3', timeStart: hm(18, 10), duration: dur(18, 10, 19, 5), task: 'SET: DJ Bliss', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_main_4', timeStart: hm(19, 10), duration: dur(19, 10, 19, 40), task: 'Prayer Time', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_thu_main_5', timeStart: hm(19, 40), duration: dur(19, 40, 20, 33), task: 'SET: Rag', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_main_6', timeStart: hm(20, 35), duration: dur(20, 35, 21, 28), task: 'SET: Labi', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_main_7', timeStart: hm(21, 30), duration: dur(21, 30, 22, 28), task: 'SET: Kimberly', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_main_8', timeStart: hm(22, 30), duration: dur(22, 30, 23, 28), task: 'SET: Viva', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_main_9', timeStart: hm(23, 30), duration: dur(23, 30, 0, 28), task: 'SET: HANNAH', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_main_10', timeStart: hm(0, 30), duration: dur(0, 30, 1, 28), task: 'SET: Brooks', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_main_11', timeStart: hm(1, 30), duration: dur(1, 30, 2, 30), task: 'SET: Third Party', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_main_12', timeStart: hm(2, 35), duration: dur(2, 35, 4, 0), task: 'SET: Alesso', crew: ['ALL UNITS'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'under': [
        { id: 'wk1_thu_under_1', timeStart: hm(17, 40), duration: dur(17, 40, 18, 10), task: 'Prayer Time', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_thu_under_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_thu_under_3', timeStart: hm(18, 10), duration: dur(18, 10, 19, 5), task: 'SET: Nik-B', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_under_4', timeStart: hm(19, 10), duration: dur(19, 10, 19, 40), task: 'Prayer Time', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_thu_under_5', timeStart: hm(19, 40), duration: dur(19, 40, 20, 58), task: 'SET: Ghost', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_under_6', timeStart: hm(21, 0), duration: dur(21, 0, 21, 58), task: 'SET: Haffs', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_under_7', timeStart: hm(22, 0), duration: dur(22, 0, 22, 58), task: 'SET: MBP', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_under_8', timeStart: hm(23, 0), duration: dur(23, 0, 23, 58), task: 'SET: Linska', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_under_9', timeStart: hm(0, 0), duration: dur(0, 0, 1, 0), task: 'SET: KREAM', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_under_10', timeStart: hm(1, 5), duration: dur(1, 5, 2, 30), task: 'SET: ARTBAT', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_under_11', timeStart: hm(2, 30), duration: dur(2, 30, 4, 0), task: 'SET: Son Of Son', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'hof': [
        { id: 'wk1_thu_hof_1', timeStart: hm(17, 40), duration: dur(17, 40, 18, 10), task: 'Prayer Time', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_thu_hof_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_thu_hof_3', timeStart: hm(18, 10), duration: dur(18, 10, 19, 5), task: 'SET: Julien Relive', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_hof_4', timeStart: hm(19, 10), duration: dur(19, 10, 19, 40), task: 'Prayer Time', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_thu_hof_5', timeStart: hm(19, 40), duration: dur(19, 40, 20, 33), task: 'SET: Largo', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_hof_6', timeStart: hm(20, 35), duration: dur(20, 35, 21, 28), task: 'SET: Gazi', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_hof_7', timeStart: hm(21, 30), duration: dur(21, 30, 22, 28), task: 'SET: RSCL', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_hof_8', timeStart: hm(22, 30), duration: dur(22, 30, 23, 28), task: 'SET: BURNR', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_hof_9', timeStart: hm(23, 30), duration: dur(23, 30, 0, 30), task: 'SET: Giu', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_hof_10', timeStart: hm(0, 35), duration: dur(0, 35, 2, 0), task: 'SET: HotSince82', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_hof_11', timeStart: hm(2, 0), duration: dur(2, 0, 2, 58), task: 'SET: Sam Collins', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_thu_hof_12', timeStart: hm(3, 0), duration: dur(3, 0, 4, 0), task: 'SET: Toby Romeo', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'hub': [
        { id: 'hub1', timeStart: 12, duration: 2, task: 'Queue Management & Gates', crew: ['V5 (Socials)', 'P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['arrival', 'id', 'consent'] },
        { id: 'hub2', timeStart: 14, duration: 2, task: 'Crowd Inflow / ID Checks', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['arrival', 'id', 'consent'] },
        { id: 'hub3', timeStart: 16, duration: 2, task: 'Brand Activation Coverage', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['branding', 'sponsor', 'popup'] },
        { id: 'hub4', timeStart: 19, duration: 2, task: 'Food Court & Chill Zone', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'food', 'crowd'] },
        { id: 'hub5', timeStart: 2, duration: 2, task: 'Egress / Taxi Stand', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['site', 'closing', 'crowd'] },
      ],
      'site': [
        { id: 'ts1', timeStart: 12, duration: 2, task: 'Site Aerials (Empty) + Infra Sweep', crew: ['D2 (Cinema)', 'P1 (Lead)'], type: 'drone', priority: 'high', shotCategories: ['site', 'branding'] },
        { id: 'ts2', timeStart: 18, duration: 2, task: 'Site Perimeter + Skyline (Live)', crew: ['D1 (FPV)'], type: 'drone', priority: 'normal', shotCategories: ['site', 'crowd', 'atmos'] },
        { id: 'ts3', timeStart: 4, duration: 1, task: 'Empty Site at Dawn', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['closing', 'site'] },
      ],
      'activations': [
        { id: 'ta1', timeStart: 16, duration: 2, task: 'Sponsor Activations + Pop-up Stages', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['sponsor', 'popup', 'branding'] },
        { id: 'ta2', timeStart: 20, duration: 2, task: 'Art Installations (Night)', crew: ['V5 (Socials)'], type: 'social', priority: 'high', shotCategories: ['art', 'sponsor', 'atmos'] },
      ],
      'merch': [
        { id: 'tm1', timeStart: 14, duration: 2, task: 'Merch Booth Pre-Open + Flat-lays', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['merch'] },
        { id: 'tm2', timeStart: 20, duration: 2, task: 'Merch Booth Peak + Models', crew: ['P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['merch', 'crowd'] },
      ],
      'food': [
        { id: 'tf1', timeStart: 14, duration: 2, task: 'Food + Bar Prep', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'food', 'branding'] },
        { id: 'tf2', timeStart: 19, duration: 2, task: 'Bar Peak + Payment Moments', crew: ['P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['bar', 'food', 'crowd'] },
        { id: 'tf3', timeStart: 2, duration: 1, task: 'Empty Bars / Closing', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'closing'] },
      ],
      'vip': [
        { id: 'tv1', timeStart: 18, duration: 2, task: 'VIP Entry + Access Control', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['vip', 'vip_service', 'arrival', 'id'] },
        { id: 'tv2', timeStart: 22, duration: 2, task: 'VIP Lounge + Boxes (Live)', crew: ['P1 (Lead)'], type: 'photo', priority: 'high', shotCategories: ['vip', 'vip_boxes', 'vip_service'] },
      ],
      'hq': [
        { id: 'hq1', timeStart: 12, duration: 2, task: 'Briefing & Gear Check', crew: ['ALL LEADS'], type: 'mgmt', priority: 'critical', shotCategories: ['bts'] },
        { id: 'hq2', timeStart: 15, duration: 1, task: 'Data Run 1 (Early Sets)', crew: ['M2 (Runner)'], type: 'mgmt', priority: 'high', shotCategories: ['backstage'] },
        { id: 'hq3', timeStart: 18, duration: 1, task: 'Food Run (Dinner)', crew: ['M3 (Runner)'], type: 'mgmt', priority: 'high', shotCategories: ['bts'] },
        { id: 'hq4', timeStart: 19, duration: 3, task: 'Socials Edit Block 1', crew: ['S2 (Editor)', 'S1 (Lead)'], type: 'social', priority: 'critical', shotCategories: ['branding'] },
        { id: 'hq5', timeStart: 22, duration: 1, task: 'Data Run 2 (Peak Sets)', crew: ['M2 (Runner)'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
        { id: 'hq6', timeStart: 1, duration: 1, task: 'Red Bull / Coffee Run', crew: ['M3 (Runner)'], type: 'mgmt', priority: 'normal', shotCategories: ['bts'] },
        { id: 'hq7', timeStart: 3, duration: 2, task: 'Final Ingest & Backup', crew: ['M1 (Mgr)', 'S3 (Editor)'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
      ]
    }
  },
  'wk1_fri': {
    date: 'Fri Feb 6',
    label: 'WK1: Friday (Full)',
    shifts: {
      'main': [
        { id: 'wk1_fri_main_1', timeStart: hm(17, 41), duration: dur(17, 41, 18, 11), task: 'Prayer Time', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_fri_main_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_fri_main_3', timeStart: hm(18, 10), duration: dur(18, 10, 18, 56), task: 'SET: FAULHABER', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_main_4', timeStart: hm(18, 56), duration: dur(18, 56, 19, 41), task: 'Prayer Time', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_fri_main_5', timeStart: hm(19, 41), duration: dur(19, 41, 20, 33), task: 'SET: Bastian', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_main_6', timeStart: hm(20, 35), duration: dur(20, 35, 21, 28), task: 'SET: NHA', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_main_7', timeStart: hm(21, 30), duration: dur(21, 30, 22, 28), task: 'SET: Yunite', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_main_8', timeStart: hm(22, 30), duration: dur(22, 30, 23, 28), task: 'SET: Crüpo', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_main_9', timeStart: hm(23, 30), duration: dur(23, 30, 0, 28), task: 'SET: Aspyer', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_main_10', timeStart: hm(0, 30), duration: dur(0, 30, 1, 28), task: 'SET: Yaz', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_main_11', timeStart: hm(1, 30), duration: dur(1, 30, 2, 30), task: 'SET: HNTR', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_main_12', timeStart: hm(2, 35), duration: dur(2, 35, 4, 0), task: 'SET: Morten', crew: ['ALL UNITS'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'under': [
        { id: 'wk1_fri_under_1', timeStart: hm(17, 41), duration: dur(17, 41, 18, 11), task: 'Prayer Time', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_fri_under_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_fri_under_3', timeStart: hm(18, 10), duration: dur(18, 10, 18, 56), task: 'SET: Ammar', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_under_4', timeStart: hm(18, 56), duration: dur(18, 56, 19, 41), task: 'Prayer Time', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_fri_under_5', timeStart: hm(19, 41), duration: dur(19, 41, 20, 58), task: 'SET: Weltron', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_under_6', timeStart: hm(21, 0), duration: dur(21, 0, 21, 58), task: 'SET: Dujak', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_under_7', timeStart: hm(22, 0), duration: dur(22, 0, 22, 58), task: 'SET: ISEK', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_under_8', timeStart: hm(23, 0), duration: dur(23, 0, 23, 58), task: 'SET: The Freaks', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_under_9', timeStart: hm(0, 0), duration: dur(0, 0, 1, 0), task: 'SET: Eva Kim', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_under_10', timeStart: hm(1, 5), duration: dur(1, 5, 3, 0), task: 'SET: Eric Prydz', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_under_11', timeStart: hm(3, 2), duration: dur(3, 2, 4, 0), task: 'SET: Sam Collins', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
      ],
      'hof': [
        { id: 'wk1_fri_hof_1', timeStart: hm(17, 41), duration: dur(17, 41, 18, 11), task: 'Prayer Time', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_fri_hof_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_fri_hof_3', timeStart: hm(18, 10), duration: dur(18, 10, 18, 56), task: 'SET: Dpawlo', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_hof_4', timeStart: hm(18, 56), duration: dur(18, 56, 19, 41), task: 'Prayer Time', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk1_fri_hof_5', timeStart: hm(19, 41), duration: dur(19, 41, 20, 33), task: 'SET: YAN.MUSIC', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_hof_6', timeStart: hm(20, 35), duration: dur(20, 35, 21, 28), task: 'SET: Luca', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_hof_7', timeStart: hm(21, 30), duration: dur(21, 30, 22, 28), task: 'SET: Ahmed Zainal', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_hof_8', timeStart: hm(22, 30), duration: dur(22, 30, 23, 28), task: 'SET: Jeme', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_hof_9', timeStart: hm(23, 30), duration: dur(23, 30, 0, 30), task: 'SET: K Led', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_hof_10', timeStart: hm(0, 35), duration: dur(0, 35, 2, 0), task: 'SET: Meduza', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_hof_11', timeStart: hm(2, 0), duration: dur(2, 0, 2, 58), task: 'SET: Igniter', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk1_fri_hof_12', timeStart: hm(3, 0), duration: dur(3, 0, 4, 0), task: 'SET: Allen Hulsey', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'hub': [
        { id: 'fhub1', timeStart: 14, duration: 2, task: 'Gates & Scanning', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['arrival', 'id', 'consent'] },
        { id: 'fhub2', timeStart: 17, duration: 1, task: 'Sunset at Plaza', crew: ['P1 (Lead)', 'V5 (Socials)'], type: 'social', priority: 'high', shotCategories: ['atmos', 'crowd'] },
        { id: 'fhub3', timeStart: 19, duration: 1, task: 'VIP Arrivals', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['vip', 'vip_service', 'arrival', 'id'] },
        { id: 'fhub4', timeStart: 21, duration: 2, task: 'Merch Store Hype', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['merch', 'crowd'] },
      ],
      'site': [
        { id: 'fsite1', timeStart: 12, duration: 2, task: 'Site Infra Sweep + Maps', crew: ['D2 (Cinema)', 'P1 (Lead)'], type: 'drone', priority: 'high', shotCategories: ['site', 'branding'] },
        { id: 'fsite2', timeStart: 18, duration: 2, task: 'Site Skyline + Crowd Flow (Live)', crew: ['D1 (FPV)'], type: 'drone', priority: 'normal', shotCategories: ['site', 'crowd', 'atmos'] },
        { id: 'fsite3', timeStart: 4, duration: 1, task: 'Exit Lighting + Empty Site', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['closing', 'site'] },
      ],
      'activations': [
        { id: 'fact1', timeStart: 16, duration: 2, task: 'Sponsor Activations + Pop-up Stages', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['sponsor', 'popup', 'branding'] },
        { id: 'fact2', timeStart: 20, duration: 2, task: 'Art Installations + Brand Moments', crew: ['V5 (Socials)'], type: 'social', priority: 'high', shotCategories: ['art', 'sponsor', 'atmos'] },
      ],
      'merch': [
        { id: 'fmer1', timeStart: 14, duration: 2, task: 'Merch Booth Pre-Open + Flat-lays', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['merch'] },
        { id: 'fmer2', timeStart: 20, duration: 2, task: 'Merch Booth Peak + Models', crew: ['P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['merch', 'crowd'] },
      ],
      'food': [
        { id: 'ffood1', timeStart: 14, duration: 2, task: 'Food + Bar Prep', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'food', 'branding'] },
        { id: 'ffood2', timeStart: 19, duration: 2, task: 'Bar Peak + Payment Moments', crew: ['P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['bar', 'food', 'crowd'] },
        { id: 'ffood3', timeStart: 2, duration: 1, task: 'Empty Bars / Closing', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'closing'] },
      ],
      'vip': [
        { id: 'fvip1', timeStart: 18, duration: 2, task: 'VIP Entry + Access Control', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['vip', 'vip_service', 'arrival', 'id'] },
        { id: 'fvip2', timeStart: 22, duration: 2, task: 'VIP Lounge + Boxes (Live)', crew: ['P1 (Lead)'], type: 'photo', priority: 'high', shotCategories: ['vip', 'vip_boxes', 'vip_service'] },
      ],
      'hq': [
        { id: 'fhq1', timeStart: 12, duration: 1, task: 'Day 2 Briefing', crew: ['ALL LEADS'], type: 'mgmt', priority: 'high', shotCategories: ['bts'] },
        { id: 'fhq2', timeStart: 14, duration: 1, task: 'Batteries to Stages', crew: ['M3 (Runner)'], type: 'mgmt', priority: 'normal', shotCategories: ['bts'] },
        { id: 'fhq3', timeStart: 16, duration: 2, task: 'Live Edit: Day 1 Recap', crew: ['S2 (Editor)', 'S3 (Editor)'], type: 'social', priority: 'critical', shotCategories: ['branding'] },
        { id: 'fhq4', timeStart: 20, duration: 1, task: 'Data Run (Main/Under)', crew: ['M2 (Runner)'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
        { id: 'fhq5', timeStart: 0, duration: 2, task: 'Reels Cut: Prydz/Meduza', crew: ['S1 (Lead)'], type: 'social', priority: 'critical', shotCategories: ['branding'] },
        { id: 'fhq6', timeStart: 3, duration: 2, task: 'End of Day Backup', crew: ['M1 (Mgr)'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
      ]
    }
  },
  'wk2_thu': {
    date: 'Thu Feb 12',
    label: 'WK2: Thursday (Full)',
    shifts: {
      'main': [
        { id: 'wk2_thu_main_1', timeStart: hm(17, 45), duration: dur(17, 45, 18, 15), task: 'Prayer Time', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_main_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_main_3', timeStart: hm(18, 15), duration: dur(18, 15, 19, 10), task: 'SET: REFLECT', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_main_4', timeStart: hm(19, 15), duration: dur(19, 15, 19, 45), task: 'Prayer Time', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_main_5', timeStart: hm(19, 45), duration: dur(19, 45, 20, 33), task: 'SET: Chris', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_main_6', timeStart: hm(20, 40), duration: dur(20, 40, 21, 28), task: 'SET: Ethan English', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_main_7', timeStart: hm(21, 30), duration: dur(21, 30, 22, 28), task: 'SET: Darris', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_main_8', timeStart: hm(22, 30), duration: dur(22, 30, 23, 28), task: 'SET: WEDAMNZ', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_main_9', timeStart: hm(23, 30), duration: dur(23, 30, 0, 28), task: 'SET: Isek', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_main_10', timeStart: hm(0, 30), duration: dur(0, 30, 1, 28), task: 'SET: Toby Romeo', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_main_11', timeStart: hm(1, 30), duration: dur(1, 30, 2, 30), task: 'SET: Dubvision', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_main_12', timeStart: hm(2, 35), duration: dur(2, 35, 4, 0), task: 'SET: Alan Walker', crew: ['ALL UNITS'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'under': [
        { id: 'wk2_thu_under_1', timeStart: hm(17, 45), duration: dur(17, 45, 18, 15), task: 'Prayer Time', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_under_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_under_3', timeStart: hm(18, 15), duration: dur(18, 15, 19, 10), task: 'SET: Tiwney', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_under_4', timeStart: hm(19, 15), duration: dur(19, 15, 19, 45), task: 'Prayer Time', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_under_5', timeStart: hm(19, 45), duration: dur(19, 45, 20, 58), task: 'SET: LANNA', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_under_6', timeStart: hm(21, 2), duration: dur(21, 2, 22, 0), task: 'SET: Aeres', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_under_7', timeStart: hm(22, 2), duration: dur(22, 2, 23, 0), task: 'SET: Max Styler', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_under_8', timeStart: hm(23, 0), duration: dur(23, 0, 23, 10), task: 'Change over', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_under_9', timeStart: hm(23, 10), duration: dur(23, 10, 0, 40), task: 'SET: Kasablanca', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_under_10', timeStart: hm(0, 40), duration: dur(0, 40, 0, 50), task: 'Change over', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_under_11', timeStart: hm(0, 50), duration: dur(0, 50, 2, 20), task: 'SET: Amelie Lens', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_under_12', timeStart: hm(2, 22), duration: dur(2, 22, 4, 0), task: 'SET: Basicz', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'hof': [
        { id: 'wk2_thu_hof_1', timeStart: hm(17, 45), duration: dur(17, 45, 18, 15), task: 'Prayer Time', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_hof_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_hof_3', timeStart: hm(18, 15), duration: dur(18, 15, 19, 10), task: 'SET: Swat Stain', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_hof_4', timeStart: hm(19, 15), duration: dur(19, 15, 19, 45), task: 'Prayer Time', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_hof_5', timeStart: hm(19, 45), duration: dur(19, 45, 20, 33), task: 'SET: Barq', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_hof_6', timeStart: hm(20, 40), duration: dur(20, 40, 21, 28), task: 'SET: Mr. Joe', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_hof_7', timeStart: hm(21, 30), duration: dur(21, 30, 22, 28), task: 'SET: Majid', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_hof_8', timeStart: hm(22, 30), duration: dur(22, 30, 23, 28), task: 'SET: Yaz', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_hof_9', timeStart: hm(23, 30), duration: dur(23, 30, 0, 25), task: 'SET: Stasi Sanlin', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_hof_10', timeStart: hm(0, 25), duration: dur(0, 25, 0, 30), task: 'Change over', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_thu_hof_11', timeStart: hm(0, 30), duration: dur(0, 30, 2, 0), task: 'SET: Zamna Soundsystem', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_hof_12', timeStart: hm(2, 2), duration: dur(2, 2, 3, 0), task: 'SET: Marten Lou', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_thu_hof_13', timeStart: hm(3, 2), duration: dur(3, 2, 4, 0), task: 'SET: Yunite', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'hub': [
        { id: 'whub1', timeStart: 14, duration: 4, task: 'Gates / Security Flow', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['arrival', 'id', 'consent'] },
        { id: 'whub2', timeStart: 18, duration: 2, task: 'Magic Hour Plaza', crew: ['P1 (Lead)', 'V5 (Socials)'], type: 'social', priority: 'normal', shotCategories: ['atmos', 'crowd'] },
        { id: 'whub3', timeStart: 22, duration: 2, task: 'Night Branding', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['branding', 'sponsor', 'popup'] },
      ],
      'site': [
        { id: 'wtsite1', timeStart: 12, duration: 2, task: 'Site Detail Sweep + Signage Close-ups', crew: ['D2 (Cinema)', 'P1 (Lead)'], type: 'drone', priority: 'high', shotCategories: ['site', 'branding'] },
        { id: 'wtsite2', timeStart: 18, duration: 2, task: 'Site Skyline + Crowd Flow (Live)', crew: ['D1 (FPV)'], type: 'drone', priority: 'normal', shotCategories: ['site', 'crowd', 'atmos'] },
        { id: 'wtsite3', timeStart: 4, duration: 1, task: 'Empty Site at Dawn', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['closing', 'site'] },
      ],
      'activations': [
        { id: 'wtact1', timeStart: 16, duration: 2, task: 'Sponsor Activations + Pop-up Stages', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['sponsor', 'popup', 'branding'] },
        { id: 'wtact2', timeStart: 20, duration: 2, task: 'Art Installations (Night)', crew: ['V5 (Socials)'], type: 'social', priority: 'high', shotCategories: ['art', 'sponsor', 'atmos'] },
      ],
      'merch': [
        { id: 'wtmer1', timeStart: 14, duration: 2, task: 'Merch Booth Pre-Open + Flat-lays', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['merch'] },
        { id: 'wtmer2', timeStart: 20, duration: 2, task: 'Merch Booth Peak + Models', crew: ['P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['merch', 'crowd'] },
      ],
      'food': [
        { id: 'wtfood1', timeStart: 14, duration: 2, task: 'Food + Bar Prep', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'food', 'branding'] },
        { id: 'wtfood2', timeStart: 19, duration: 2, task: 'Bar Peak + Payment Moments', crew: ['P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['bar', 'food', 'crowd'] },
        { id: 'wtfood3', timeStart: 2, duration: 1, task: 'Empty Bars / Closing', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'closing'] },
      ],
      'vip': [
        { id: 'wtvip1', timeStart: 18, duration: 2, task: 'VIP Entry + Access Control', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['vip', 'vip_service', 'arrival', 'id'] },
        { id: 'wtvip2', timeStart: 22, duration: 2, task: 'VIP Lounge + Boxes (Live)', crew: ['P1 (Lead)'], type: 'photo', priority: 'high', shotCategories: ['vip', 'vip_boxes', 'vip_service'] },
      ],
      'hq': [
        { id: 'whq1', timeStart: 12, duration: 1, task: 'WK2 Kickoff Brief', crew: ['ALL LEADS'], type: 'mgmt', priority: 'high', shotCategories: ['bts'] },
        { id: 'whq2', timeStart: 15, duration: 1, task: 'Card Formats & Distro', crew: ['M1 (Mgr)'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
        { id: 'whq3', timeStart: 18, duration: 4, task: 'Live Socials Push', crew: ['S1 (Lead)', 'S2 (Editor)'], type: 'social', priority: 'high', shotCategories: ['branding'] },
        { id: 'whq4', timeStart: 23, duration: 1, task: 'Data Run (Main)', crew: ['M2 (Runner)'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
        { id: 'whq5', timeStart: 2, duration: 3, task: 'Ingest & Backup', crew: ['S3 (Editor)', 'M1 (Mgr)'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
      ]
    }
  },
  'wk2_fri': {
    date: 'Fri Feb 13',
    label: 'WK2: Friday (Full)',
    shifts: {
      'main': [
        { id: 'wk2_fri_main_1', timeStart: hm(17, 46), duration: dur(17, 46, 18, 16), task: 'Prayer Time', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_fri_main_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_fri_main_3', timeStart: hm(18, 16), duration: dur(18, 16, 19, 6), task: 'SET: Mish', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_main_4', timeStart: hm(19, 16), duration: dur(19, 16, 19, 46), task: 'Prayer Time', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_fri_main_5', timeStart: hm(19, 46), duration: dur(19, 46, 20, 33), task: 'SET: Space Gurll', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_main_6', timeStart: hm(20, 35), duration: dur(20, 35, 21, 28), task: 'SET: David Allen', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_main_7', timeStart: hm(21, 30), duration: dur(21, 30, 22, 28), task: 'SET: Blackcode', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_main_8', timeStart: hm(22, 30), duration: dur(22, 30, 23, 28), task: 'SET: Vikkstar', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_main_9', timeStart: hm(23, 30), duration: dur(23, 30, 0, 28), task: 'SET: Justin Mylo', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_main_10', timeStart: hm(0, 30), duration: dur(0, 30, 2, 0), task: 'SET: Martin Garrix', crew: ['ALL UNITS'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_main_11', timeStart: hm(2, 2), duration: dur(2, 2, 2, 58), task: 'SET: Yaz', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_main_12', timeStart: hm(3, 0), duration: dur(3, 0, 4, 0), task: 'SET: Matt Pridgyn', crew: ['B2 (Front)', 'P2 (Main)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'under': [
        { id: 'wk2_fri_under_1', timeStart: hm(17, 46), duration: dur(17, 46, 18, 16), task: 'Prayer Time', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_fri_under_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_fri_under_3', timeStart: hm(18, 16), duration: dur(18, 16, 19, 6), task: 'SET: Rudlf B2B Bhydra', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_under_4', timeStart: hm(19, 16), duration: dur(19, 16, 19, 46), task: 'Prayer Time', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_fri_under_5', timeStart: hm(19, 46), duration: dur(19, 46, 21, 0), task: 'SET: HANNAH', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_under_6', timeStart: hm(21, 0), duration: dur(21, 0, 21, 58), task: 'SET: Wooka', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_under_7', timeStart: hm(22, 0), duration: dur(22, 0, 22, 58), task: 'SET: Midway', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_under_8', timeStart: hm(23, 0), duration: dur(23, 0, 23, 58), task: 'SET: Alaa Jazaeri', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_under_9', timeStart: hm(0, 0), duration: dur(0, 0, 1, 0), task: 'SET: RDJ', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_under_10', timeStart: hm(1, 2), duration: dur(1, 2, 3, 0), task: 'SET: MATHAME', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_under_11', timeStart: hm(3, 2), duration: dur(3, 2, 4, 0), task: 'SET: The Freaks (live)', crew: ['B3 (Jib)', 'P3 (Under)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'hof': [
        { id: 'wk2_fri_hof_1', timeStart: hm(17, 46), duration: dur(17, 46, 18, 16), task: 'Prayer Time', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_fri_hof_2', timeStart: hm(18, 0), duration: 0, task: 'Doors open', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_fri_hof_3', timeStart: hm(18, 16), duration: dur(18, 16, 19, 6), task: 'SET: Chesho', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_hof_4', timeStart: hm(19, 16), duration: dur(19, 16, 19, 46), task: 'Prayer Time', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'normal' },
        { id: 'wk2_fri_hof_5', timeStart: hm(19, 46), duration: dur(19, 46, 20, 33), task: 'SET: TBC', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_hof_6', timeStart: hm(20, 35), duration: dur(20, 35, 21, 28), task: 'SET: Ghaderz', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_hof_7', timeStart: hm(21, 30), duration: dur(21, 30, 22, 28), task: 'SET: Moontalk', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_hof_8', timeStart: hm(22, 32), duration: dur(22, 32, 0, 0), task: 'SET: Caiiro', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_hof_9', timeStart: hm(0, 2), duration: dur(0, 2, 1, 30), task: 'SET: Onfaya', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_hof_10', timeStart: hm(1, 32), duration: dur(1, 32, 3, 0), task: 'SET: Nitefreak', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'high', shotCategories: ['dj_set'] },
        { id: 'wk2_fri_hof_11', timeStart: hm(3, 2), duration: dur(3, 2, 4, 0), task: 'SET: Igniter', crew: ['B4 (Stage)', 'P4 (HOF)'], type: 'broadcast', priority: 'critical', shotCategories: ['dj_set'] },
      ],
      'hub': [
        { id: 'wfhub1', timeStart: 14, duration: 2, task: 'Final Day Arrivals', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['arrival', 'id', 'consent'] },
        { id: 'wfhub2', timeStart: 17, duration: 1, task: 'Last Sunset Aerials', crew: ['D2 (Cinema)'], type: 'drone', priority: 'high', shotCategories: ['site', 'atmos', 'crowd'] },
        { id: 'wfhub3', timeStart: 20, duration: 3, task: 'Sponsor Wrap Up', crew: ['P1 (Lead)'], type: 'mgmt', priority: 'normal', shotCategories: ['sponsor', 'branding', 'closing'] },
      ],
      'site': [
        { id: 'wfsit1', timeStart: 12, duration: 2, task: 'Site Detail Sweep + Signage Close-ups', crew: ['D2 (Cinema)', 'P1 (Lead)'], type: 'drone', priority: 'high', shotCategories: ['site', 'branding'] },
        { id: 'wfsit2', timeStart: 18, duration: 2, task: 'Site Skyline + Crowd Flow (Live)', crew: ['D1 (FPV)'], type: 'drone', priority: 'normal', shotCategories: ['site', 'crowd', 'atmos'] },
        { id: 'wfsit3', timeStart: 4, duration: 1, task: 'Empty Site at Dawn', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['closing', 'site'] },
      ],
      'activations': [
        { id: 'wfact1', timeStart: 16, duration: 2, task: 'Sponsor Activations + Pop-up Stages', crew: ['P1 (Lead)'], type: 'photo', priority: 'normal', shotCategories: ['sponsor', 'popup', 'branding'] },
        { id: 'wfact2', timeStart: 20, duration: 2, task: 'Art Installations (Night)', crew: ['V5 (Socials)'], type: 'social', priority: 'high', shotCategories: ['art', 'sponsor', 'atmos'] },
      ],
      'merch': [
        { id: 'wfmer1', timeStart: 14, duration: 2, task: 'Merch Booth Pre-Open + Flat-lays', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['merch'] },
        { id: 'wfmer2', timeStart: 20, duration: 2, task: 'Merch Booth Peak + Models', crew: ['P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['merch', 'crowd'] },
      ],
      'food': [
        { id: 'wffood1', timeStart: 14, duration: 2, task: 'Food + Bar Prep', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'food', 'branding'] },
        { id: 'wffood2', timeStart: 19, duration: 2, task: 'Bar Peak + Payment Moments', crew: ['P5 (Roam)'], type: 'photo', priority: 'high', shotCategories: ['bar', 'food', 'crowd'] },
        { id: 'wffood3', timeStart: 2, duration: 1, task: 'Empty Bars / Closing', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['bar', 'closing'] },
      ],
      'vip': [
        { id: 'wfvip1', timeStart: 18, duration: 2, task: 'VIP Entry + Access Control', crew: ['P5 (Roam)'], type: 'photo', priority: 'normal', shotCategories: ['vip', 'vip_service', 'arrival', 'id'] },
        { id: 'wfvip2', timeStart: 22, duration: 2, task: 'VIP Lounge + Boxes (Live)', crew: ['P1 (Lead)'], type: 'photo', priority: 'high', shotCategories: ['vip', 'vip_boxes', 'vip_service'] },
      ],
      'hq': [
        { id: 'wfhq1', timeStart: 12, duration: 1, task: 'Final Day Briefing', crew: ['ALL CREW'], type: 'mgmt', priority: 'critical', shotCategories: ['bts'] },
        { id: 'wfhq2', timeStart: 15, duration: 1, task: 'Gear Check / Returns Plan', crew: ['M1 (Mgr)'], type: 'mgmt', priority: 'high', shotCategories: ['backstage'] },
        { id: 'wfhq3', timeStart: 18, duration: 2, task: 'Live Edit: Final Push', crew: ['S2 (Editor)', 'S3 (Editor)'], type: 'social', priority: 'critical', shotCategories: ['branding'] },
        { id: 'wfhq4', timeStart: 22, duration: 1, task: 'Data Run (All Stages)', crew: ['M2 (Runner)'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
        { id: 'wfhq5', timeStart: 2, duration: 4, task: 'FINAL BACKUP & WRAP', crew: ['ALL MGMT', 'ALL LEADS'], type: 'mgmt', priority: 'critical', shotCategories: ['backstage'] },
      ]
    }
  }
};

const TEAM_COLORS: Record<TeamType, string> = {
  photo: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200',
  video: 'bg-purple-500/20 border-purple-500/50 text-purple-200',
  social: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
  drone: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
  mgmt: 'bg-red-500/20 border-red-500/50 text-red-200',
  broadcast: 'bg-[#FFBF00]/20 border-[#FFBF00]/50 text-[#FFBF00]',
};

// --- COMPONENTS ---

export const ProductionMatrix = () => {
  const [activeDay, setActiveDay] = useState('wk1_thu');
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  
  // Form State
  const [newTaskTask, setNewTaskTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('14');
  const [newTaskDuration, setNewTaskDuration] = useState('1');
  const [newTaskLocation, setNewTaskLocation] = useState('main');
  const [newTaskType, setNewTaskType] = useState<TeamType>('photo');
  const [newTaskPriority, setNewTaskPriority] = useState('normal');

  const currentSchedule = schedule[activeDay];
  const crewCounts = selectedShift ? getCrewTeamCounts(selectedShift.crew) : null;

  const handleAddTask = () => {
    if (!newTaskTask) return;

    const newShift: Shift = {
      id: Math.random().toString(36).substr(2, 9),
      timeStart: parseFloat(newTaskTime),
      duration: parseFloat(newTaskDuration),
      task: newTaskTask,
      crew: [`${newTaskType.toUpperCase()} Team`], 
      type: newTaskType,
      priority: newTaskPriority as any,
      shotCategories: ['dj_set']
    };

    setSchedule(prev => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        shifts: {
          ...prev[activeDay].shifts,
          [newTaskLocation]: [
            ...(prev[activeDay].shifts[newTaskLocation] || []),
            newShift
          ]
        }
      }
    }));

    setIsAddOpen(false);
    setNewTaskTask('');
  };

  const getCrewCount = () => {
    return Object.values(CREW_ROSTER).reduce((acc, team) => acc + team.length, 0);
  };
  const gridTemplateColumns = `80px repeat(${LOCATIONS.length}, minmax(140px, 1fr))`;
  const gridMinWidth = 80 + (LOCATIONS.length * 160);

  return (
    <div className="space-y-6">
      
      {/* TEAM OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
           <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-2"><Disc size={10}/> Broadcast</div>
           <div className="text-xl font-black text-[#FFBF00]">{CREW_ROSTER.broadcast.length} <span className="text-[10px] font-normal text-zinc-600">Pax</span></div>
           <div className="text-[9px] text-zinc-500 mt-1 leading-tight">Full Set Rec</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
           <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-2"><Camera size={10}/> Photo</div>
           <div className="text-xl font-black text-cyan-400">{CREW_ROSTER.photo.length} <span className="text-[10px] font-normal text-zinc-600">Pax</span></div>
           <div className="text-[9px] text-zinc-500 mt-1 leading-tight">Stills/Moments</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
           <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-2"><Video size={10}/> Video</div>
           <div className="text-xl font-black text-purple-400">{CREW_ROSTER.video.length} <span className="text-[10px] font-normal text-zinc-600">Pax</span></div>
           <div className="text-[9px] text-zinc-500 mt-1 leading-tight">Aftermovie/Social</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
           <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-2"><Share2 size={10}/> Social</div>
           <div className="text-xl font-black text-blue-400">{CREW_ROSTER.social.length} <span className="text-[10px] font-normal text-zinc-600">Pax</span></div>
           <div className="text-[9px] text-zinc-500 mt-1 leading-tight">Live Coverage</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
           <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-2"><ShieldAlert size={10}/> Mgmt</div>
           <div className="text-xl font-black text-red-400">{CREW_ROSTER.mgmt.length} <span className="text-[10px] font-normal text-zinc-600">Pax</span></div>
           <div className="text-[9px] text-zinc-500 mt-1 leading-tight">Runners/Ops</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg bg-gradient-to-br from-zinc-900 to-[#FFBF00]/10">
           <div className="text-zinc-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-2"><Users size={10}/> Status</div>
           <div className="flex items-end gap-2">
             <div className="text-2xl font-black text-white">{getCrewCount()} <span className="text-xs font-normal text-zinc-600">Crew</span></div>
             <Badge variant="outline" className="border-[#FFBF00] text-[#FFBF00] bg-[#FFBF00]/20 text-[10px] mb-1">LIVE</Badge>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: MATRIX */}
        <div className="xl:col-span-2 space-y-6">
          {/* MATRIX CONTROLS */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-zinc-950/50 p-6 rounded-xl border border-zinc-800">
            <div>
              <h2 className="text-2xl font-black uppercase text-white flex items-center gap-3">
                <Aperture className="text-[#FFBF00]" /> Matrix V3.1
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                {currentSchedule.label} Deployment
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
              <div className="flex flex-wrap gap-2">
                {Object.entries(schedule).map(([key, day]) => (
                  <button
                    key={key}
                    onClick={() => setActiveDay(key)}
                    className={cn(
                      "px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-all",
                      activeDay === key 
                        ? "bg-[#FFBF00] text-black border-[#FFBF00]" 
                        : "bg-black/40 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
                    )}
                  >
                    <span className="block text-[9px] opacity-70">{day.date}</span>
                    {day.label.split(':')[1]}
                  </button>
                ))}
              </div>

              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-zinc-200 font-bold uppercase text-xs tracking-wider gap-2">
                    <Plus size={14} /> Add Set
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                  <DialogHeader>
                    <DialogTitle>Deploy New Mission / Set</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Configure coverage for a new artist set or mission.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Task / Artist</Label>
                      <Input 
                        placeholder="e.g. SET: Artist Name" 
                        className="bg-zinc-900 border-zinc-800"
                        value={newTaskTask}
                        onChange={(e) => setNewTaskTask(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Select value={newTaskTime} onValueChange={setNewTaskTime}>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                            {HOURS.map(h => (
                              <SelectItem key={h} value={h.toString()}>{formatTime(h)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Duration (Hrs)</Label>
                        <Select value={newTaskDuration} onValueChange={setNewTaskDuration}>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                            <SelectItem value="1">1 Hour</SelectItem>
                            <SelectItem value="2">2 Hours</SelectItem>
                            <SelectItem value="3">3 Hours</SelectItem>
                            <SelectItem value="4">4 Hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Select value={newTaskLocation} onValueChange={setNewTaskLocation}>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                            {LOCATIONS.map(l => (
                              <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Lead Unit</Label>
                        <Select value={newTaskType} onValueChange={(v) => setNewTaskType(v as TeamType)}>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                            <SelectItem value="broadcast">Broadcast (Full Set)</SelectItem>
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="drone">Drone</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white">Cancel</Button>
                    <Button onClick={handleAddTask} className="bg-[#FFBF00] text-black hover:bg-[#FFBF00]">Confirm Deployment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* THE GRID */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <ScrollArea className="h-[700px] w-full">
              <div style={{ minWidth: gridMinWidth }}>
                
                {/* GRID HEADER */}
                <div
                  className="grid sticky top-0 z-20 bg-zinc-950 border-b border-zinc-800 shadow-md"
                  style={{ gridTemplateColumns }}
                >
                  <div className="p-4 flex items-center justify-center border-r border-zinc-800 bg-zinc-950/50 font-mono text-xs text-zinc-500">
                    TIME
                  </div>
                  {LOCATIONS.map(loc => (
                    <div key={loc.id} className="p-4 border-r border-zinc-800/50 flex flex-col items-center justify-center gap-2 bg-zinc-900">
                      {loc.icon}
                      <span className="font-bold text-[10px] uppercase text-zinc-300 text-center">{loc.name}</span>
                    </div>
                  ))}
                </div>

                {/* GRID BODY */}
                {HOURS.map((hour) => {
                  const displayTime = formatTime(hour);
                  
                  return (
                    <div
                      key={hour}
                      className="grid border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors group"
                      style={{ gridTemplateColumns }}
                    >
                      
                      {/* Time Column */}
                      <div className="p-3 border-r border-zinc-800 bg-zinc-950/30 flex items-center justify-center font-mono text-xs text-zinc-500 font-bold group-hover:text-zinc-300">
                        {displayTime}
                      </div>

                      {/* Location Columns */}
                      {LOCATIONS.map((loc) => {
                        const shifts = currentSchedule.shifts[loc.id] || [];
                        const getLinearHour = (h: number) => h < DAY_START ? h + 24 : h;
                        const rowStart = getLinearHour(hour);
                        const rowEnd = rowStart + SLOT_HOURS;
                        const startingShifts = shifts
                          .filter(s => {
                            const startLinear = getLinearHour(s.timeStart);
                            return startLinear >= rowStart && startLinear < rowEnd;
                          })
                          .sort((a, b) => getLinearHour(a.timeStart) - getLinearHour(b.timeStart));
                        const hasOverlap = shifts.some(s => {
                          const startLinear = getLinearHour(s.timeStart);
                          const endLinear = startLinear + s.duration;
                          return startLinear < rowEnd && endLinear > rowStart;
                        });
                        const isOccupied = hasOverlap && startingShifts.length === 0;

                        if (isOccupied) return <div key={loc.id} className="border-r border-zinc-800/30 bg-zinc-900/10"></div>;

                        return (
                          <div key={loc.id} className="p-1 border-r border-zinc-800/30 relative min-h-[60px]">
                            {startingShifts.map((shift) => {
                              const startLinear = getLinearHour(shift.timeStart);
                              const startOffset = Math.max(0, startLinear - rowStart);
                              const displayDuration = Math.max(shift.duration, MIN_DISPLAY_DURATION);

                              return (
                                <div 
                                  key={shift.id}
                                  onClick={() => setSelectedShift(shift)}
                                  className={cn(
                                    "absolute left-1 right-1 z-10 p-2 rounded border shadow-lg flex flex-col gap-1 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform",
                                    TEAM_COLORS[shift.type],
                                    shift.priority === 'critical' ? 'animate-pulse ring-1 ring-red-500' : ''
                                  )}
                                  style={{ 
                                    top: `calc(${(startOffset / SLOT_HOURS) * 100}% + 4px)`,
                                    height: `calc(${(displayDuration / SLOT_HOURS) * 100}% - 8px)`
                                  }}
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="font-bold text-[10px] uppercase leading-tight line-clamp-2">{shift.task}</span>
                                    {shift.priority === 'critical' && <AlertTriangle size={10} className="text-red-500 shrink-0" />}
                                  </div>
                                  <div className="mt-auto flex flex-wrap gap-1">
                                    {shift.crew.map((person, i) => (
                                      <Badge key={i} variant="secondary" className="h-4 text-[8px] px-1 bg-black/50 border-0 text-white/80">
                                        {person.split(' ')[0]}
                                      </Badge>
                                    ))}
                                  </div>
                                  {shift.shotCategories && shift.shotCategories.length > 0 && (
                                     <div className="absolute bottom-1 right-1">
                                        <ListChecks size={10} className="text-current opacity-70" />
                                     </div>
                                  )}
                                </div>
                              );
                            })}
                            {!hasOverlap && startingShifts.length === 0 && (
                              <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity">
                                <div className="w-1 h-1 bg-zinc-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>

        {/* RIGHT COLUMN: SHOT LIST / DETAILS */}
        <div className="xl:col-span-1">
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl h-full flex flex-col overflow-hidden sticky top-6">
              <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
                 <h3 className="font-bold text-white flex items-center gap-2">
                   <ListChecks className="text-[#FFBF00]" /> 
                   {selectedShift ? 'Mission Objectives' : 'Select a Mission'}
                 </h3>
              </div>
              
              <ScrollArea className="flex-1">
                 <div className="p-4 space-y-6">
                    {selectedShift ? (
                      <>
                        <div className="space-y-2">
                           <div className="flex justify-between items-start">
                             <Badge variant="outline" className={cn("text-xs", TEAM_COLORS[selectedShift.type])}>
                               {selectedShift.type.toUpperCase()} TEAM
                             </Badge>
                             {selectedShift.priority === 'critical' && <Badge variant="destructive" className="text-[10px]">PRIORITY</Badge>}
                           </div>
                           <h2 className="text-xl font-black text-white leading-tight">{selectedShift.task}</h2>
                           <div className="flex items-center gap-4 text-xs text-zinc-400">
                             <span className="flex items-center gap-1"><Clock size={12}/> {formatTime(selectedShift.timeStart)} - {formatTime(selectedShift.timeStart + selectedShift.duration)}</span>
                             <span className="flex items-center gap-1"><Users size={12}/> {selectedShift.crew.length} Units</span>
                           </div>
                           {crewCounts && (
                             <div className="flex flex-wrap gap-3 text-[10px] uppercase text-zinc-500">
                               {crewCounts.photo > 0 && <span className="flex items-center gap-1"><Camera size={10} /> {crewCounts.photo} Photo</span>}
                               {crewCounts.video > 0 && <span className="flex items-center gap-1"><Video size={10} /> {crewCounts.video} Video</span>}
                               {crewCounts.broadcast > 0 && <span className="flex items-center gap-1"><Disc size={10} /> {crewCounts.broadcast} Broadcast</span>}
                               {crewCounts.drone > 0 && <span className="flex items-center gap-1"><Plane size={10} /> {crewCounts.drone} Drone</span>}
                               {crewCounts.social > 0 && <span className="flex items-center gap-1"><Share2 size={10} /> {crewCounts.social} Social</span>}
                               {crewCounts.mgmt > 0 && <span className="flex items-center gap-1"><ShieldAlert size={10} /> {crewCounts.mgmt} Mgmt</span>}
                             </div>
                           )}
                        </div>

                        {/* Special Prompt for Full Set Recordings */}
                        {selectedShift.task.startsWith("SET:") && (
                          <div className="bg-[#FFBF00]/20 border border-[#FFBF00]/30 p-3 rounded text-[#FFBF00] text-xs">
                             <strong className="flex items-center gap-2 mb-1"><Disc size={12}/> FULL SET RECORDING REQUIRED</strong>
                             Ensure continuous coverage from start to finish. Audio tap from FOH required.
                          </div>
                        )}

                        {selectedShift.shotCategories?.map(catId => {
                          const cat = SHOT_LIST[catId];
                          if(!cat) return null;
                          return (
                            <div key={cat.id} className="bg-black/20 rounded p-3 border border-zinc-800/50">
                               <h4 className="font-bold text-zinc-300 text-xs uppercase mb-2 flex items-center gap-2">
                                 <ChevronRight size={12} className="text-[#FFBF00]"/> {cat.title}
                               </h4>
                               <ul className="space-y-1.5">
                                 {cat.items.map((item, i) => (
                                   <li key={i} className="text-xs text-zinc-400 pl-4 relative">
                                     <span className="absolute left-0 top-1.5 w-1 h-1 bg-zinc-600 rounded-full"></span>
                                     {item}
                                   </li>
                                 ))}
                               </ul>
                            </div>
                          )
                        })}
                        
                        {(!selectedShift.shotCategories || selectedShift.shotCategories.length === 0) && (
                          <div className="text-zinc-500 text-sm italic p-4 text-center border border-dashed border-zinc-800 rounded">
                            No specific shot list assigned to this block. Standard coverage applies.
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-[400px] flex flex-col items-center justify-center text-zinc-500 space-y-4 text-center">
                         <div className="p-4 bg-zinc-950 rounded-full border border-zinc-800">
                           <Aperture size={32} className="opacity-50"/>
                         </div>
                         <p className="text-sm max-w-[200px]">Click on any shift block in the matrix to view detailed shot requirements and crew instructions.</p>
                      </div>
                    )}
                 </div>
              </ScrollArea>
           </div>
        </div>

      </div>
    </div>
  );
};
