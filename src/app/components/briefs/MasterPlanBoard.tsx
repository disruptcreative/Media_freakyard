import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { 
  Camera, Video, Share2, ShieldAlert, GripVertical, Clock, MapPin, 
  MoreHorizontal, Plus, User, AlertCircle 
} from 'lucide-react';

// --- TYPES ---
type TaskType = 'photo' | 'video' | 'social' | 'mgmt';

interface Task {
  id: string;
  title: string;
  time: string;
  area: string;
  type: TaskType;
  crew: string;
}

interface Column {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  tasks: Task[];
}

// --- DATA ---
const INITIAL_COLUMNS: Record<string, Column> = {
  photo: {
    id: 'photo',
    title: 'Photo Ops',
    icon: <Camera className="w-4 h-4" />,
    color: 'border-cyan-500/50 text-cyan-400',
    tasks: [
      { id: 'p1', title: 'Site Aerials (Empty) + Perimeter', time: 'Build Phase', area: 'Site / Perimeter', type: 'photo', crew: 'Photo Lead + Drone' },
      { id: 'p2', title: 'Site Aerials (Live) + Skyline', time: 'Sunset', area: 'Site / Skyline', type: 'photo', crew: 'Photo Lead + Drone' },
      { id: 'p3', title: 'Entry Gates + Queue Formations', time: '12:00 - 16:00', area: 'Entrance', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p4', title: 'Ticket Scanning + Wristbands + Security', time: '14:00 - 18:00', area: 'Entry Lanes', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p5', title: 'Branding + Wayfinding System', time: '16:00 - 20:00', area: 'Site Wide', type: 'photo', crew: 'Photo Lead' },
      { id: 'p6', title: 'Wristbands / Passes / ID Macro', time: '14:00 - 18:00', area: 'Entry', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p7', title: 'Consent + Safety Signage', time: '14:00 - 18:00', area: 'Entry / Crowd', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p8', title: 'Crowd Wide / Mid / Close', time: 'Peak Sets', area: 'All Stages', type: 'photo', crew: 'Photo Main' },
      { id: 'p9', title: 'Fashion / Accessories / Makeup', time: '18:00 - 22:00', area: 'Crowd', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p10', title: 'Mainstage Coverage (Empty + Live)', time: '16:00 - 02:00', area: 'Mainstage', type: 'photo', crew: 'Photo Main' },
      { id: 'p11', title: 'Underground Stage Textures', time: '20:00 - 03:00', area: 'Underground', type: 'photo', crew: 'Photo Under' },
      { id: 'p12', title: 'House of Freaks Performers', time: '20:00 - 02:00', area: 'HoF', type: 'photo', crew: 'Photo HoF' },
      { id: 'p13', title: 'Pop-up Stages + Sponsor Logos', time: '18:00 - 00:00', area: 'Activations', type: 'photo', crew: 'Photo Lead' },
      { id: 'p14', title: 'Art Installations + Interactions', time: '19:00 - 23:00', area: 'Art Zone', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p15', title: 'Sponsor Activations Coverage', time: '16:00 - 22:00', area: 'Sponsor Zone', type: 'photo', crew: 'Photo Lead' },
      { id: 'p16', title: 'Bar Program + Drink Prep', time: '18:00 - 02:00', area: 'Bars', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p17', title: 'Food & Catering Moments', time: '17:00 - 21:00', area: 'Food Court', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p18', title: 'VIP Lounge + Boxes', time: '19:00 - 01:00', area: 'VIP', type: 'photo', crew: 'Photo Lead' },
      { id: 'p19', title: 'VIP Service Moments', time: '20:00 - 00:00', area: 'VIP', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p20', title: 'Backstage / Ops Coverage', time: '14:00 - 22:00', area: 'Backstage', type: 'photo', crew: 'Photo Lead' },
      { id: 'p21', title: 'Merch Booth + Models', time: '20:00 - 23:00', area: 'Merch', type: 'photo', crew: 'Roaming Unit' },
      { id: 'p22', title: 'Transitions & Atmosphere', time: 'Sunset / Blue Hour', area: 'Site', type: 'photo', crew: 'Photo Lead' },
      { id: 'p23', title: 'Closing + Empty Site', time: '02:00 - 05:00', area: 'Site', type: 'photo', crew: 'Roaming Unit' },
    ]
  },
  video: {
    id: 'video',
    title: 'Video Unit',
    icon: <Video className="w-4 h-4" />,
    color: 'border-pink-500/50 text-pink-400',
    tasks: [
      { id: 'v1', title: 'Build Phase Timelapses', time: 'Build Phase', area: 'All Stages', type: 'video', crew: 'Hero Video' },
      { id: 'v2', title: 'Behind-the-Scenes Build Videos', time: 'Build Phase', area: 'Site / Backstage', type: 'video', crew: 'BTS Unit' },
      { id: 'v3', title: 'Influencer Pre-Party Aftermovie (1 min)', time: 'Pre-Party 20:00 - 04:00', area: 'Main + HoF', type: 'video', crew: 'Hero Video' },
      { id: 'v4', title: 'Daily Recap Videos (4 days)', time: 'Night + AM', area: 'Edit Bay', type: 'video', crew: 'Editors' },
      { id: 'v5', title: 'Daily Highlights (4 days)', time: 'Night', area: 'Edit Bay', type: 'video', crew: 'Social Video' },
      { id: 'v6', title: 'Social Reels (10-15)', time: 'Daily', area: 'All Zones', type: 'video', crew: 'Social Video' },
      { id: 'v7', title: 'Merch Coverage (Models + Booth)', time: 'Peak Hours', area: 'Merch', type: 'video', crew: 'Hero Video' },
      { id: 'v8', title: 'Main Aftermovie (Mascot Storyline)', time: 'Post', area: 'Edit Suite', type: 'video', crew: 'Director + Motion' },
      { id: 'v9', title: 'Per-Stage Aftermovies (Main/Under/HoF)', time: 'Post', area: 'Edit Suite', type: 'video', crew: 'Relive Team' },
      { id: 'v10', title: 'Sponsor Videos (7-10, up to 1 min)', time: 'Daily + Post', area: 'Sponsor Zone', type: 'video', crew: 'Brand Video' },
      { id: 'v11', title: 'Artist Recaps (108 artists)', time: 'Night + Post', area: 'All Stages', type: 'video', crew: 'Relive Team' },
      { id: 'v12', title: 'B-Roll Library (Atmos/Infra/Crowd)', time: 'Daily', area: 'Site Wide', type: 'video', crew: 'B-Roll Unit' },
      { id: 'v13', title: 'Full Set Recordings', time: 'Live Sets', area: 'All Stages', type: 'video', crew: 'Relive + Broadcast' },
      { id: 'v14', title: 'Crowd POV + Stage POV Swaps', time: 'Peak Sets', area: 'Main / Under', type: 'video', crew: 'Gimbal Op' },
      { id: 'v15', title: 'Drone Cinematic Sweeps', time: 'Sunset / Night', area: 'Site', type: 'video', crew: 'Drone Cinema' },
    ]
  },
  social: {
    id: 'social',
    title: 'Social / Marketing',
    icon: <Share2 className="w-4 h-4" />,
    color: 'border-blue-500/50 text-blue-400',
    tasks: [
      { id: 's1', title: 'Build Phase Hype Clips', time: 'Build Phase', area: 'Site', type: 'social', crew: 'Social Lead' },
      { id: 's2', title: 'Influencer Arrivals + Wristbands', time: 'Pre-Party', area: 'Entry', type: 'social', crew: 'Social Lead' },
      { id: 's3', title: 'Daily IG Stories Coverage', time: 'Live', area: 'All Zones', type: 'social', crew: 'Social Team' },
      { id: 's4', title: 'Artist Quick Interviews', time: 'Daily', area: 'Backstage', type: 'social', crew: 'Social Team' },
      { id: 's5', title: 'Countdown + Gates Open', time: '14:00', area: 'Entry', type: 'social', crew: 'Social Team' },
      { id: 's6', title: 'Live Drop Reactions', time: 'Peak Sets', area: 'Main / Under', type: 'social', crew: 'Social Team' },
      { id: 's7', title: 'Sponsor Shoutouts', time: 'Daily', area: 'Sponsor Zone', type: 'social', crew: 'Social Team' },
      { id: 's8', title: 'Merch Features + Fit Checks', time: 'Peak Hours', area: 'Merch', type: 'social', crew: 'Social Team' },
      { id: 's9', title: 'Daily Recap Posting', time: '02:00 - 08:00', area: 'Edit Bay', type: 'social', crew: 'Editors' },
      { id: 's10', title: 'Morning Upload + Scheduling', time: '08:00 - 10:00', area: 'HQ', type: 'social', crew: 'Social Lead' },
    ]
  },
  mgmt: {
    id: 'mgmt',
    title: 'Command Center',
    icon: <ShieldAlert className="w-4 h-4" />,
    color: 'border-yellow-500/50 text-yellow-400',
    tasks: [
      { id: 'm1', title: 'Build Permits + Drone Clearance', time: 'Pre-Event', area: 'HQ', type: 'mgmt', crew: 'Prod Mgr' },
      { id: 'm2', title: 'Crew Briefing + Safety', time: 'Daily 12:00', area: 'HQ', type: 'mgmt', crew: 'Prod Mgr' },
      { id: 'm3', title: 'Media Passes + Wristband Distribution', time: 'Pre-Event', area: 'HQ', type: 'mgmt', crew: 'Prod Mgr' },
      { id: 'm4', title: 'Radio Channel Sync', time: 'Daily', area: 'HQ', type: 'mgmt', crew: 'Ops' },
      { id: 'm5', title: 'Data Run (Cards) 18:00', time: 'Daily', area: 'All Stages', type: 'mgmt', crew: 'Runner' },
      { id: 'm6', title: 'Data Run (Cards) 22:00', time: 'Daily', area: 'All Stages', type: 'mgmt', crew: 'Runner' },
      { id: 'm7', title: 'Nightly Backup + Verify', time: '02:00 - 05:00', area: 'HQ', type: 'mgmt', crew: 'Data Wrangler' },
      { id: 'm8', title: 'Gear Check + Battery Swaps', time: 'Daily', area: 'HQ', type: 'mgmt', crew: 'Ops' },
      { id: 'm9', title: 'Consent / Release Compliance', time: 'Daily', area: 'Entry', type: 'mgmt', crew: 'Ops' },
      { id: 'm10', title: 'Sponsor Shot Approvals', time: 'Daily', area: 'Sponsor Zone', type: 'mgmt', crew: 'Prod Mgr' },
      { id: 'm11', title: 'Artist Recap Tracker (108)', time: 'Daily', area: 'HQ', type: 'mgmt', crew: 'Prod Mgr' },
      { id: 'm12', title: 'Deliverables Deadlines Tracker', time: 'Daily', area: 'HQ', type: 'mgmt', crew: 'Prod Mgr' },
      { id: 'm13', title: 'Final Wrap + Equipment Return', time: 'Post', area: 'HQ', type: 'mgmt', crew: 'Ops' },
    ]
  }
};

const ItemType = 'TASK';

// --- COMPONENTS ---

const DraggableTask = ({ task, color }: { task: Task, color: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: task.id, type: task.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "bg-zinc-900/80 border border-zinc-800 p-3 rounded mb-2 cursor-move hover:border-zinc-600 transition-all group relative overflow-hidden",
        isDragging ? "opacity-50" : "opacity-100",
        color.split(" ")[0] // Apply border color
      )}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-50", color.replace('border-', 'bg-').replace('/50', ''))} />
      
      <div className="flex justify-between items-start mb-2 pl-2">
        <h4 className="font-bold text-sm text-zinc-100 leading-tight">{task.title}</h4>
        <GripVertical className="text-zinc-600 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="space-y-1.5 pl-2">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Clock size={12} /> <span>{task.time}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <MapPin size={12} /> <span>{task.area}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1 border-t border-zinc-800/50 mt-2">
          <User size={12} /> <span className="uppercase tracking-wider font-mono text-[10px]">{task.crew}</span>
        </div>
      </div>
    </div>
  );
};

const DroppableColumn = ({ column, moveTask, onAddClick }: { column: Column, moveTask: (taskId: string, targetColId: string) => void, onAddClick: (colId: string) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { id: string }) => moveTask(item.id, column.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cn(
        "flex-1 min-w-[280px] bg-zinc-950/50 border border-zinc-800/50 rounded-lg flex flex-col transition-colors",
        isOver ? "bg-zinc-900/80 border-zinc-600" : ""
      )}
    >
      {/* Column Header */}
      <div className={cn("p-4 border-b border-zinc-800 flex items-center justify-between", column.color)}>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
          {column.icon}
          {column.title}
        </div>
        <Badge variant="secondary" className="bg-black/50 text-zinc-400 border-zinc-800">{column.tasks.length}</Badge>
      </div>

      {/* Tasks Area */}
      <div className="p-3 flex-1 overflow-y-auto min-h-[500px]">
        {column.tasks.map((task) => (
          <DraggableTask key={task.id} task={task} color={column.color} />
        ))}
        {column.tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic border-2 border-dashed border-zinc-900 rounded">
            No active missions
          </div>
        )}
      </div>
      
      {/* Quick Add */}
      <div className="p-3 border-t border-zinc-800">
        <button 
          onClick={() => onAddClick(column.id)}
          className="w-full py-2 flex items-center justify-center gap-2 text-xs uppercase font-bold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-all"
        >
          <Plus size={14} /> Assign Mission
        </button>
      </div>
    </div>
  );
};

// --- MAIN BOARD ---
export const MasterPlanBoard = () => {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  
  // Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCrew, setNewCrew] = useState('');

  const moveTask = (taskId: string, targetColId: string) => {
    setColumns((prev) => {
      // Find source column and task
      let sourceColId = '';
      let taskToMove: Task | undefined;

      for (const [colId, col] of Object.entries(prev)) {
        const task = col.tasks.find(t => t.id === taskId);
        if (task) {
          sourceColId = colId;
          taskToMove = task;
          break;
        }
      }

      if (!taskToMove || !sourceColId || sourceColId === targetColId) {
        return prev;
      }

      // Create new state
      const newSourceTasks = prev[sourceColId].tasks.filter(t => t.id !== taskId);
      const newTargetTasks = [...prev[targetColId].tasks, taskToMove];

      return {
        ...prev,
        [sourceColId]: { ...prev[sourceColId], tasks: newSourceTasks },
        [targetColId]: { ...prev[targetColId], tasks: newTargetTasks },
      };
    });
  };

  const handleOpenAdd = (colId: string) => {
    setTargetColumn(colId);
    setNewTitle('');
    setNewTime('');
    setNewArea('');
    setNewCrew('');
    setIsAddOpen(true);
  };

  const handleAddTask = () => {
    if (!newTitle || !targetColumn) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      time: newTime || 'TBD',
      area: newArea || 'TBD',
      crew: newCrew || 'Unassigned',
      type: targetColumn as TaskType
    };

    setColumns(prev => ({
      ...prev,
      [targetColumn]: {
        ...prev[targetColumn],
        tasks: [...prev[targetColumn].tasks, newTask]
      }
    }));

    setIsAddOpen(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black uppercase text-white flex items-center gap-3">
              <AlertCircle className="text-[#FFBF00]" /> Operational Master Plan
            </h3>
            <p className="text-zinc-400 text-sm mt-1">Drag and drop missions to re-assign teams live.</p>
          </div>
          <div className="flex gap-2">
             <Badge variant="outline" className="border-[#FFBF00] text-[#FFBF00] bg-[#FFBF00]/20 animate-pulse">LIVE UPDATE ACTIVE</Badge>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6">
          {Object.values(columns).map((col) => (
            <DroppableColumn key={col.id} column={col} moveTask={moveTask} onAddClick={handleOpenAdd} />
          ))}
        </div>

        {/* ADD TASK DIALOG */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-wider">Assign New Mission</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Enter details for the new mission assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-zinc-400">Mission Title</Label>
                <Input 
                  id="title" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="e.g. Stage Setup Timelapse"
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="time" className="text-zinc-400">Time Window</Label>
                  <Input 
                    id="time" 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)} 
                    placeholder="14:00 - 15:00"
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="area" className="text-zinc-400">Location</Label>
                  <Input 
                    id="area" 
                    value={newArea} 
                    onChange={(e) => setNewArea(e.target.value)} 
                    placeholder="Mainstage"
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="crew" className="text-zinc-400">Assigned Crew</Label>
                <Input 
                  id="crew" 
                  value={newCrew} 
                  onChange={(e) => setNewCrew(e.target.value)} 
                  placeholder="Team A / John Doe"
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white">Cancel</Button>
              <Button onClick={handleAddTask} className="bg-[#FFBF00] text-black hover:bg-[#FFBF00] font-bold">Create Mission</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
};
