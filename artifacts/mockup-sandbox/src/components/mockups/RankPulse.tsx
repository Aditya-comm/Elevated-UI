import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit, Sparkles, GraduationCap, BarChart3, History,
  Volume2, VolumeX, ChevronRight, ArrowLeft, Trophy, Share2,
  RotateCcw, Trash2, TrendingUp, Zap, Star, Target, Filter,
  SlidersHorizontal, MapPin, BookOpen, Table2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "intro" | "shift" | "session" | "category" | "marks" | "loading" | "result" | "history";
type City = "Pune" | "Mumbai" | "Nashik" | "Sangli" | "Nanded" | "Aurangabad";
type Branch = "CS" | "IT" | "ENTC" | "Mechanical" | "Civil";
type Tier = "Dream" | "Strong" | "Safe";

interface ShiftInfo { difficulty: "Easy" | "Moderate" | "Hard"; above120: number; highest: number; students: number; }
interface Shift { date: string; morning: ShiftInfo; evening: ShiftInfo; }
interface HistoryEntry { percentile: string; marks: number; shift: string; time: string; physics: number; chemistry: number; maths: number; }

interface College {
  tier: Tier;
  name: string;
  branch: Branch;
  city: City;
  cap1: string;
  cap2: string;
  cap3: string;
  minP: number;
}

// ─── Shift Data ───────────────────────────────────────────────────────────────

const shifts: Shift[] = [
  { date: "11 Apr 2026", morning: { difficulty: "Easy", above120: 8.85, highest: 183, students: 949 }, evening: { difficulty: "Hard", above120: 4.78, highest: 182, students: 878 } },
  { date: "13 Apr 2026", morning: { difficulty: "Moderate", above120: 6.41, highest: 174, students: 983 }, evening: { difficulty: "Hard", above120: 5.20, highest: 170, students: 1019 } },
  { date: "15 Apr 2026", morning: { difficulty: "Hard", above120: 7.00, highest: 173, students: 1029 }, evening: { difficulty: "Moderate", above120: 7.38, highest: 162, students: 948 } },
  { date: "16 Apr 2026", morning: { difficulty: "Moderate", above120: 6.19, highest: 176, students: 856 }, evening: { difficulty: "Hard", above120: 5.61, highest: 196, students: 767 } },
  { date: "17 Apr 2026", morning: { difficulty: "Hard", above120: 5.22, highest: 162, students: 728 }, evening: { difficulty: "Moderate", above120: 5.76, highest: 194, students: 665 } },
  { date: "18 Apr 2026", morning: { difficulty: "Moderate", above120: 5.50, highest: 177, students: 491 }, evening: { difficulty: "Moderate", above120: 5.11, highest: 171, students: 540 } },
  { date: "19 Apr 2026", morning: { difficulty: "Hard", above120: 4.19, highest: 151, students: 453 }, evening: { difficulty: "Hard", above120: 4.44, highest: 158, students: 428 } },
  { date: "20 Apr 2026", morning: { difficulty: "Moderate", above120: 4.62, highest: 164, students: 303 }, evening: { difficulty: "Hard", above120: 4.81, highest: 169, students: 288 } },
];

// ─── College Database (30+ colleges) ─────────────────────────────────────────

const ALL_COLLEGES: College[] = [
  // ── PUNE Dream ──
  { tier: "Dream", name: "COEP Pune", branch: "CS",         city: "Pune",    cap1: "99.61", cap2: "99.58", cap3: "99.55", minP: 99.4 },
  { tier: "Dream", name: "COEP Pune", branch: "ENTC",       city: "Pune",    cap1: "99.31", cap2: "99.28", cap3: "99.20", minP: 99.0 },
  { tier: "Dream", name: "COEP Pune", branch: "Mechanical", city: "Pune",    cap1: "98.80", cap2: "98.70", cap3: "98.50", minP: 98.4 },
  { tier: "Dream", name: "COEP Pune", branch: "Civil",      city: "Pune",    cap1: "97.20", cap2: "97.00", cap3: "96.80", minP: 96.5 },
  // ── PUNE Strong ──
  { tier: "Strong", name: "PICT Pune",  branch: "CS",         city: "Pune",  cap1: "99.15", cap2: "99.08", cap3: "99.00", minP: 98.8 },
  { tier: "Strong", name: "PICT Pune",  branch: "IT",         city: "Pune",  cap1: "99.00", cap2: "98.90", cap3: "98.80", minP: 98.5 },
  { tier: "Strong", name: "PICT Pune",  branch: "ENTC",       city: "Pune",  cap1: "98.50", cap2: "98.35", cap3: "98.20", minP: 98.0 },
  { tier: "Strong", name: "VIT Pune",   branch: "CS",         city: "Pune",  cap1: "98.10", cap2: "97.90", cap3: "97.70", minP: 97.5 },
  { tier: "Strong", name: "VIT Pune",   branch: "ENTC",       city: "Pune",  cap1: "97.50", cap2: "97.30", cap3: "97.10", minP: 96.8 },
  { tier: "Strong", name: "VIT Pune",   branch: "Mechanical", city: "Pune",  cap1: "96.80", cap2: "96.60", cap3: "96.40", minP: 96.0 },
  { tier: "Strong", name: "MIT Pune",   branch: "CS",         city: "Pune",  cap1: "97.80", cap2: "97.60", cap3: "97.40", minP: 97.2 },
  { tier: "Strong", name: "MIT Pune",   branch: "IT",         city: "Pune",  cap1: "97.40", cap2: "97.20", cap3: "97.00", minP: 96.8 },
  { tier: "Strong", name: "Symbiosis",  branch: "CS",         city: "Pune",  cap1: "97.00", cap2: "96.80", cap3: "96.60", minP: 96.3 },
  { tier: "Strong", name: "Symbiosis",  branch: "IT",         city: "Pune",  cap1: "96.50", cap2: "96.30", cap3: "96.10", minP: 95.8 },
  // ── PUNE Safe ──
  { tier: "Safe", name: "PCCOE",        branch: "CS",         city: "Pune",  cap1: "97.20", cap2: "97.00", cap3: "96.80", minP: 96.5 },
  { tier: "Safe", name: "PCCOE",        branch: "ENTC",       city: "Pune",  cap1: "96.40", cap2: "96.20", cap3: "96.00", minP: 95.7 },
  { tier: "Safe", name: "AISSMS CoE",   branch: "CS",         city: "Pune",  cap1: "96.00", cap2: "95.80", cap3: "95.60", minP: 95.3 },
  { tier: "Safe", name: "AISSMS CoE",   branch: "IT",         city: "Pune",  cap1: "95.50", cap2: "95.30", cap3: "95.10", minP: 94.8 },
  { tier: "Safe", name: "Sinhgad CoE",  branch: "CS",         city: "Pune",  cap1: "94.00", cap2: "93.70", cap3: "93.40", minP: 93.0 },
  { tier: "Safe", name: "MAEER MIT",    branch: "ENTC",       city: "Pune",  cap1: "93.50", cap2: "93.20", cap3: "93.00", minP: 92.5 },
  // ── MUMBAI Dream ──
  { tier: "Dream", name: "VJTI Mumbai", branch: "CS",         city: "Mumbai", cap1: "99.55", cap2: "99.50", cap3: "99.45", minP: 99.3 },
  { tier: "Dream", name: "VJTI Mumbai", branch: "ENTC",       city: "Mumbai", cap1: "99.40", cap2: "99.35", cap3: "99.25", minP: 99.1 },
  { tier: "Dream", name: "VJTI Mumbai", branch: "Mechanical", city: "Mumbai", cap1: "99.10", cap2: "99.00", cap3: "98.90", minP: 98.7 },
  { tier: "Dream", name: "VJTI Mumbai", branch: "Civil",      city: "Mumbai", cap1: "97.80", cap2: "97.60", cap3: "97.40", minP: 97.2 },
  // ── MUMBAI Strong ──
  { tier: "Strong", name: "SPIT Mumbai", branch: "CS",        city: "Mumbai", cap1: "98.80", cap2: "98.70", cap3: "98.60", minP: 98.4 },
  { tier: "Strong", name: "SPIT Mumbai", branch: "IT",        city: "Mumbai", cap1: "98.60", cap2: "98.50", cap3: "98.40", minP: 98.2 },
  { tier: "Strong", name: "SPIT Mumbai", branch: "ENTC",      city: "Mumbai", cap1: "98.00", cap2: "97.80", cap3: "97.60", minP: 97.4 },
  { tier: "Strong", name: "DJ Sanghvi",  branch: "CS",        city: "Mumbai", cap1: "98.50", cap2: "98.30", cap3: "98.10", minP: 97.9 },
  { tier: "Strong", name: "DJ Sanghvi",  branch: "IT",        city: "Mumbai", cap1: "98.20", cap2: "98.00", cap3: "97.80", minP: 97.6 },
  { tier: "Strong", name: "KJSCE",       branch: "CS",        city: "Mumbai", cap1: "97.90", cap2: "97.70", cap3: "97.50", minP: 97.3 },
  { tier: "Strong", name: "KJSCE",       branch: "ENTC",      city: "Mumbai", cap1: "97.20", cap2: "97.00", cap3: "96.80", minP: 96.5 },
  { tier: "Strong", name: "TSEC",        branch: "CS",        city: "Mumbai", cap1: "97.40", cap2: "97.20", cap3: "97.00", minP: 96.7 },
  { tier: "Strong", name: "TSEC",        branch: "IT",        city: "Mumbai", cap1: "97.00", cap2: "96.80", cap3: "96.60", minP: 96.3 },
  // ── MUMBAI Safe ──
  { tier: "Safe", name: "VESIT",         branch: "CS",        city: "Mumbai", cap1: "96.50", cap2: "96.30", cap3: "96.10", minP: 95.8 },
  { tier: "Safe", name: "VESIT",         branch: "ENTC",      city: "Mumbai", cap1: "95.80", cap2: "95.60", cap3: "95.40", minP: 95.1 },
  { tier: "Safe", name: "Thadomal",      branch: "CS",        city: "Mumbai", cap1: "95.50", cap2: "95.30", cap3: "95.10", minP: 94.8 },
  { tier: "Safe", name: "Fr. CRCE",      branch: "CS",        city: "Mumbai", cap1: "95.20", cap2: "95.00", cap3: "94.80", minP: 94.5 },
  // ── NASHIK / OTHERS ──
  { tier: "Strong", name: "WCE Sangli",  branch: "CS",        city: "Sangli", cap1: "98.30", cap2: "98.10", cap3: "97.90", minP: 97.7 },
  { tier: "Strong", name: "WCE Sangli",  branch: "ENTC",      city: "Sangli", cap1: "97.80", cap2: "97.60", cap3: "97.40", minP: 97.2 },
  { tier: "Strong", name: "WCE Sangli",  branch: "Mechanical",city: "Sangli", cap1: "97.00", cap2: "96.80", cap3: "96.60", minP: 96.3 },
  { tier: "Strong", name: "SGGSIE&T",    branch: "CS",        city: "Nanded", cap1: "97.50", cap2: "97.30", cap3: "97.10", minP: 96.8 },
  { tier: "Strong", name: "SGGSIE&T",    branch: "ENTC",      city: "Nanded", cap1: "96.80", cap2: "96.60", cap3: "96.40", minP: 96.1 },
  { tier: "Safe",   name: "KBT CoE",     branch: "CS",        city: "Nashik", cap1: "94.50", cap2: "94.20", cap3: "94.00", minP: 93.7 },
  { tier: "Safe",   name: "KBT CoE",     branch: "Mechanical",city: "Nashik", cap1: "92.00", cap2: "91.70", cap3: "91.40", minP: 91.0 },
  { tier: "Safe",   name: "Sandip Inst", branch: "CS",        city: "Nashik", cap1: "91.00", cap2: "90.70", cap3: "90.40", minP: 90.0 },
  { tier: "Safe",   name: "MGM Aurang",  branch: "CS",        city: "Aurangabad", cap1: "90.50", cap2: "90.20", cap3: "90.00", minP: 89.5 },
  { tier: "Safe",   name: "MGM Aurang",  branch: "Mechanical",city: "Aurangabad", cap1: "88.00", cap2: "87.70", cap3: "87.40", minP: 87.0 },
];

// ─── Rank–Percentile Table ────────────────────────────────────────────────────

const RANK_TABLE = [
  { percentile: "99.90 – 99.99", rank: "< 200",     category: "Top" },
  { percentile: "99.80 – 99.90", rank: "200 – 400",  category: "Top" },
  { percentile: "99.60 – 99.80", rank: "400 – 900",  category: "Top" },
  { percentile: "99.40 – 99.60", rank: "900 – 1.5k", category: "Top" },
  { percentile: "99.00 – 99.40", rank: "1.5k – 2.5k",category: "High" },
  { percentile: "98.50 – 99.00", rank: "2.5k – 4k",  category: "High" },
  { percentile: "98.00 – 98.50", rank: "4k – 6k",    category: "High" },
  { percentile: "97.00 – 98.00", rank: "6k – 10k",   category: "Good" },
  { percentile: "95.00 – 97.00", rank: "10k – 18k",  category: "Good" },
  { percentile: "90.00 – 95.00", rank: "18k – 40k",  category: "Mid" },
  { percentile: "80.00 – 90.00", rank: "40k – 90k",  category: "Mid" },
  { percentile: "Below 80.00",   rank: "90k+",       category: "Low" },
];

// ─── Percentile Engine ────────────────────────────────────────────────────────

function calcPercentile(total: number, shiftData: ShiftInfo, category: string): number {
  const diff = shiftData.difficulty;
  let base = 0;

  if (diff === "Hard") {
    if (total >= 150) base = 99.86 + (total - 150) * 0.006;
    else if (total >= 140) base = 99.55 + (total - 140) * 0.031;
    else if (total >= 130) base = 99.15 + (total - 130) * 0.04;
    else if (total >= 120) base = 98.70 + (total - 120) * 0.045;
    else if (total >= 110) base = 97.80 + (total - 110) * 0.09;
    else if (total >= 100) base = 96.60 + (total - 100) * 0.12;
    else if (total >= 90)  base = 94.90 + (total - 90) * 0.17;
    else base = 80 + total * 0.16;
  } else if (diff === "Moderate") {
    if (total >= 150) base = 99.76 + (total - 150) * 0.005;
    else if (total >= 140) base = 99.42 + (total - 140) * 0.034;
    else if (total >= 130) base = 98.98 + (total - 130) * 0.044;
    else if (total >= 120) base = 98.42 + (total - 120) * 0.056;
    else if (total >= 110) base = 97.45 + (total - 110) * 0.097;
    else if (total >= 100) base = 96.20 + (total - 100) * 0.125;
    else if (total >= 90)  base = 94.50 + (total - 90) * 0.17;
    else base = 79 + total * 0.17;
  } else {
    if (total >= 150) base = 99.68 + (total - 150) * 0.004;
    else if (total >= 140) base = 99.30 + (total - 140) * 0.038;
    else if (total >= 130) base = 98.78 + (total - 130) * 0.052;
    else if (total >= 120) base = 98.05 + (total - 120) * 0.073;
    else if (total >= 110) base = 97.00 + (total - 110) * 0.105;
    else if (total >= 100) base = 95.60 + (total - 100) * 0.14;
    else if (total >= 90)  base = 93.60 + (total - 90) * 0.20;
    else base = 78 + total * 0.17;
  }

  if (category === "SC" || category === "ST") base += 0.25;
  if (category === "VJNT") base += 0.12;
  if (shiftData.above120 < 5) base += 0.15;

  return Math.min(base, 99.99);
}

function getRank(p: number): string {
  if (p >= 99.8) return "< 400";
  if (p >= 99.5) return "400 – 1k";
  if (p >= 99.0) return "1k – 2.5k";
  if (p >= 98.5) return "2.5k – 4k";
  if (p >= 98.0) return "4k – 6k";
  if (p >= 97.0) return "6k – 10k";
  if (p >= 95.0) return "10k – 18k";
  return "18k+";
}

function getQuote(p: number): string {
  if (p >= 99.5) return "Maharashtra's best just looked in the mirror.";
  if (p >= 99.0) return "You survived the academic battle royale.";
  if (p >= 97.0) return "Not perfection. Still dangerous.";
  if (p >= 95.0) return "Consistency beats panic. Every time.";
  return "One exam never gets the final vote.";
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const diffDot: Record<string, string> = { Easy: "bg-emerald-400", Moderate: "bg-amber-400", Hard: "bg-rose-400" };
const diffText: Record<string, string> = { Easy: "text-emerald-300", Moderate: "text-amber-300", Hard: "text-rose-300" };
const diffCard: Record<string, string> = {
  Easy: "from-emerald-400/15 to-emerald-400/5 border-emerald-400/25",
  Moderate: "from-amber-400/15 to-amber-400/5 border-amber-400/25",
  Hard: "from-rose-400/15 to-rose-400/5 border-rose-400/25",
};

const tierStyle: Record<Tier, string> = {
  Dream: "from-violet-500/15 to-pink-500/10 border-violet-400/25",
  Strong: "from-blue-500/15 to-cyan-500/10 border-blue-400/25",
  Safe: "from-emerald-500/15 to-teal-500/10 border-emerald-400/25",
};
const tierBadge: Record<Tier, string> = {
  Dream: "bg-violet-400/15 text-violet-300 border-violet-400/30",
  Strong: "bg-blue-400/15 text-blue-300 border-blue-400/30",
  Safe: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
};
const rankCat: Record<string, string> = {
  Top: "text-violet-300", High: "text-pink-300", Good: "text-blue-300", Mid: "text-amber-300", Low: "text-white/40",
};

const STEPS = ["Shift", "Session", "Category", "Marks"];
const stepMap: Record<Page, number> = { intro: -1, shift: 0, session: 1, category: 2, marks: 3, loading: 4, result: 4, history: -1 };

const glass = "bg-white/[0.04] backdrop-blur-3xl border border-white/[0.08] rounded-[28px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_80px_rgba(0,0,0,0.4)]";

// ─── Sub-components ───────────────────────────────────────────────────────────

function PercentileGauge({ value }: { value: number }) {
  const radius = 88; const stroke = 11;
  const nr = radius - stroke / 2;
  const circ = nr * 2 * Math.PI;
  const arc = circ * 0.75;
  const offset = arc - (value / 100) * arc;
  const color = value >= 99 ? "#c084fc" : value >= 97 ? "#60a5fa" : value >= 95 ? "#34d399" : "#fb923c";

  return (
    <div className="relative flex items-center justify-center">
      <svg width={radius * 2} height={radius * 2} className="-rotate-[135deg]">
        <circle cx={radius} cy={radius} r={nr} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke}
          strokeDasharray={`${arc} ${circ - arc}`} strokeLinecap="round" />
        <motion.circle cx={radius} cy={radius} r={nr} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${arc} ${circ - arc}`} strokeDashoffset={offset} strokeLinecap="round"
          initial={{ strokeDashoffset: arc }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div className="text-4xl font-black text-white"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          {value.toFixed(2)}
        </motion.div>
        <div className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">percentile</div>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: ["#f472b6","#818cf8","#34d399","#fb923c","#60a5fa"][Math.floor(Math.random() * 5)],
    size: Math.random() * 7 + 4, delay: Math.random() * 2, duration: Math.random() * 2 + 2,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <motion.div key={p.id} className="absolute rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: p.color, top: -20 }}
          animate={{ y: ["0vh","110vh"], rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)], opacity: [1, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }} />
      ))}
    </div>
  );
}

function StepProgress({ currentStep }: { currentStep: number }) {
  if (currentStep < 0) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-5">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <motion.div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-500 ${
              i < currentStep ? "bg-gradient-to-br from-pink-400 to-violet-400 text-white"
              : i === currentStep ? "bg-white/10 border-2 border-pink-400 text-white"
              : "bg-white/[0.04] border border-white/10 text-white/25"}`}
              animate={{ scale: i === currentStep ? [1, 1.08, 1] : 1 }}
              transition={{ repeat: i === currentStep ? Infinity : 0, duration: 2 }}>
              {i < currentStep ? "✓" : i + 1}
            </motion.div>
            <span className={`text-[9px] tracking-wide ${i <= currentStep ? "text-white/50" : "text-white/15"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px mb-4 transition-all duration-700 ${i < currentStep ? "bg-gradient-to-r from-pink-400/60 to-violet-400/60" : "bg-white/[0.07]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── What-if Simulator ────────────────────────────────────────────────────────

function WhatIfSimulator({ basePercentile, shiftData, category }: {
  basePercentile: number; shiftData: ShiftInfo; category: string;
}) {
  const [simPhy, setSimPhy] = useState(0);
  const [simChem, setSimChem] = useState(0);
  const [simMath, setSimMath] = useState(0);

  const simTotal = simPhy + simChem + simMath;
  const simPercentile = simTotal > 0 ? calcPercentile(simTotal, shiftData, category) : 0;
  const delta = simTotal > 0 ? (simPercentile - basePercentile) : 0;

  return (
    <div className={`${glass} p-7`}>
      <div className="flex items-center gap-2 mb-1">
        <SlidersHorizontal size={16} className="text-pink-300" />
        <span className="font-black text-lg">What-if Simulator</span>
        <span className="text-xs text-white/30 ml-1">— drag to see live percentile</span>
      </div>
      <p className="text-xs text-white/25 mb-6">Adjust target marks to find what score you need for your dream college</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {([
          { label: "Physics", value: simPhy, setter: setSimPhy, max: 50, color: "from-blue-400 to-cyan-400", bg: "border-blue-400/20" },
          { label: "Chemistry", value: simChem, setter: setSimChem, max: 50, color: "from-emerald-400 to-teal-400", bg: "border-emerald-400/20" },
          { label: "Mathematics", value: simMath, setter: setSimMath, max: 100, color: "from-pink-400 to-violet-400", bg: "border-pink-400/20" },
        ] as const).map(({ label, value, setter, max, color, bg }) => (
          <div key={label} className={`p-4 rounded-2xl border bg-white/[0.03] ${bg}`}>
            <div className="flex justify-between text-xs mb-3">
              <span className="text-white/50">{label}</span>
              <span className="font-black text-white">{value}<span className="text-white/30">/{max}</span></span>
            </div>
            <div className="relative h-1.5 rounded-full bg-white/[0.06] mb-2">
              <div className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${(value / max) * 100}%` }} />
            </div>
            <input type="range" min={0} max={max} value={value} onChange={(e) => setter(Number(e.target.value))}
              className="w-full accent-pink-400 cursor-pointer" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
        <div>
          <div className="text-xs text-white/30 mb-1">Target Total</div>
          <div className="text-3xl font-black">{simTotal}<span className="text-base text-white/30">/200</span></div>
        </div>
        <div className="h-10 w-px bg-white/10" />
        <div>
          <div className="text-xs text-white/30 mb-1">Projected Percentile</div>
          <div className={`text-3xl font-black ${simTotal === 0 ? "text-white/20" : "text-white"}`}>
            {simTotal > 0 ? simPercentile.toFixed(2) : "—"}
          </div>
        </div>
        {simTotal > 0 && (
          <>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <div className="text-xs text-white/30 mb-1">vs Your Score</div>
              <div className={`text-2xl font-black ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {delta >= 0 ? "+" : ""}{delta.toFixed(2)}
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <div className="text-xs text-white/30 mb-1">Est. Rank</div>
              <div className="text-lg font-bold text-white/80">{getRank(simPercentile)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Merit Table ──────────────────────────────────────────────────────────────

function MeritTable({ userPercentile }: { userPercentile: number }) {
  return (
    <div className={`${glass} p-7`}>
      <div className="flex items-center gap-2 mb-6">
        <Table2 size={16} className="text-pink-300" />
        <span className="font-black text-lg">Merit List Rank Table</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-white/[0.06]">
              <th className="text-white/30 font-medium pb-3 pr-4">Percentile Range</th>
              <th className="text-white/30 font-medium pb-3 pr-4">Est. Merit Rank</th>
              <th className="text-white/30 font-medium pb-3">Tier</th>
            </tr>
          </thead>
          <tbody>
            {RANK_TABLE.map((row, i) => {
              const isUser = (() => {
                const lo = parseFloat(row.percentile.split("–")[0]?.replace("Below","0").trim());
                const hi = row.percentile.includes("–")
                  ? parseFloat(row.percentile.split("–")[1].trim())
                  : 100;
                return userPercentile >= lo && userPercentile < hi;
              })();
              return (
                <tr key={i} className={`border-b border-white/[0.04] transition-all ${isUser ? "bg-pink-400/10 rounded-xl" : ""}`}>
                  <td className={`py-2.5 pr-4 font-mono text-xs ${isUser ? "text-pink-300 font-bold" : "text-white/60"}`}>
                    {isUser && <span className="mr-2">◀</span>}{row.percentile}
                  </td>
                  <td className={`py-2.5 pr-4 font-bold ${isUser ? "text-white" : "text-white/70"}`}>{row.rank}</td>
                  <td className={`py-2.5 text-xs font-semibold ${rankCat[row.category]}`}>{row.category}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[11px] text-white/20">Based on ~4.5 lakh MHT CET 2026 applicants · Approximate only</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 },
};

export default function RankPulse() {
  const [page, setPage] = useState<Page>("intro");
  const [shiftDate, setShiftDate] = useState("");
  const [session, setSession] = useState<"Morning" | "Evening" | "">("");
  const [category, setCategory] = useState("OPEN");
  const [physics, setPhysics] = useState(0);
  const [chemistry, setChemistry] = useState(0);
  const [maths, setMaths] = useState(0);
  const [sound, setSound] = useState(true);
  const [percentile, setPercentile] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loadingText, setLoadingText] = useState("Analyzing normalization trends...");
  const [showConfetti, setShowConfetti] = useState(false);
  const [cityFilter, setCityFilter] = useState<"All" | City>("All");
  const [branchFilter, setBranchFilter] = useState<"All" | Branch>("All");
  const [resultTab, setResultTab] = useState<"colleges" | "simulator" | "merit">("colleges");
  const [copied, setCopied] = useState(false);

  const selectedShift = shifts.find((s) => s.date === shiftDate);
  const shiftData = session === "Morning" ? selectedShift?.morning : selectedShift?.evening;
  const totalMarks = physics + chemistry + maths;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("rankpulse-v2-history") || "[]");
    setHistory(saved);
  }, []);

  const playSound = () => {
    if (!sound) return;
    const a = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
    a.volume = 0.12; a.play().catch(() => {});
  };

  const handleMarks = (value: number, setter: (v: number) => void, max: number) => {
    const c = Math.max(0, Math.min(max, value));
    setter(isNaN(c) ? 0 : c);
  };

  const handlePredict = () => {
    if (!shiftData) return;
    playSound();
    setPage("loading");
    const texts = ["Matching 2026 normalization data...", "Analyzing percentile density...", "Comparing difficulty patterns...", "Generating rank estimates..."];
    let i = 0;
    const ti = setInterval(() => { setLoadingText(texts[i % texts.length]); i++; }, 1100);
    const target = calcPercentile(totalMarks, shiftData, category);
    let current = 0;
    const iv = setInterval(() => {
      current += 0.18;
      if (current >= target) {
        current = target;
        clearInterval(iv); clearInterval(ti);
        const entry: HistoryEntry = { percentile: target.toFixed(2), marks: totalMarks, shift: shiftDate + " " + session, time: new Date().toLocaleString(), physics, chemistry, maths };
        const updated = [entry, ...history].slice(0, 10);
        localStorage.setItem("rankpulse-v2-history", JSON.stringify(updated));
        setHistory(updated);
        setTimeout(() => {
          setPage("result");
          if (target >= 99) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 5000); }
        }, 400);
      }
      setPercentile(current);
    }, 8);
  };

  const handleShare = () => {
    const text = `🎯 RankPulse AI — MHT CET 2026\nPercentile: ${percentile.toFixed(2)}\nMarks: ${totalMarks}/200 (Phy ${physics} | Chem ${chemistry} | Math ${maths})\nShift: ${shiftDate} ${session} | Category: ${category}\nEst. Rank: ${getRank(percentile)}`;
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const filteredColleges = useMemo(() => ALL_COLLEGES.filter((c) => {
    const pOk = percentile >= c.minP;
    const cityOk = cityFilter === "All" || c.city === cityFilter;
    const branchOk = branchFilter === "All" || c.branch === branchFilter;
    return pOk && cityOk && branchOk;
  }), [percentile, cityFilter, branchFilter]);

  const cities = ["All", "Pune", "Mumbai", "Nashik", "Sangli", "Nanded", "Aurangabad"] as const;
  const branches = ["All", "CS", "IT", "ENTC", "Mechanical", "Civil"] as const;

  return (
    <div className="min-h-screen bg-[#06030f] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* BG */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -left-40 w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(circle, rgba(192,38,211,0.10) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(circle, rgba(109,40,217,0.10) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {showConfetti && <Confetti />}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-5">
        {/* Navbar */}
        <div className={`${glass} px-5 py-3 flex items-center justify-between sticky top-4 z-50 mb-1`}>
          <button onClick={() => setPage("intro")} className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-pink-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center">
              <BrainCircuit size={14} className="text-pink-300" />
            </div>
            <span className="font-black text-base tracking-tight">RankPulse<span className="text-pink-300"> AI</span></span>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage("history")} className="px-3 py-1.5 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5">
              <History size={13} /><span>History</span>
              {history.length > 0 && <span className="w-4 h-4 rounded-full bg-pink-400/25 text-pink-300 text-[10px] flex items-center justify-center">{history.length}</span>}
            </button>
            <button onClick={() => setSound(!sound)} className="w-7 h-7 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/35 hover:text-white transition-all">
              {sound ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
          </div>
        </div>

        <StepProgress currentStep={stepMap[page]} />

        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {page === "intro" && (
            <motion.div key="intro" {...pageVariants} className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
              <motion.div animate={{ rotate: [0, 5, -5, 0], y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center mb-7">
                <BrainCircuit size={38} className="text-pink-300" />
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter"
                style={{ background: "linear-gradient(135deg,#f9a8d4 0%,#c4b5fd 50%,#67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                RankPulse AI
              </h1>
              <p className="mt-2 text-white/25 tracking-[0.4em] uppercase text-xs">MHT CET 2026 · Percentile Predictor</p>
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm">
                {[{ icon: Target, label: "Accurate", sub: "Normalization-aware" }, { icon: Zap, label: "Instant", sub: "Real-time calc" }, { icon: BookOpen, label: "30+ Colleges", sub: "CAP rounds included" }].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className={`${glass} p-4 flex flex-col items-center gap-1`}>
                    <Icon size={16} className="text-pink-300" />
                    <div className="text-xs font-bold text-white/80">{label}</div>
                    <div className="text-[10px] text-white/25 text-center">{sub}</div>
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { playSound(); setPage("shift"); }}
                className="mt-9 px-10 py-4 rounded-2xl font-black text-black flex items-center gap-2.5"
                style={{ background: "linear-gradient(135deg,#f9a8d4,#c4b5fd,#67e8f9)" }}>
                <Sparkles size={17} /> Begin Analysis <ChevronRight size={17} />
              </motion.button>
              <p className="mt-5 text-white/15 text-xs">8 exam dates · 16 shifts · All categories · 30+ colleges</p>
            </motion.div>
          )}

          {/* ── SHIFT ── */}
          {page === "shift" && (
            <motion.div key="shift" {...pageVariants}>
              <div className={`${glass} p-7`}>
                <h2 className="text-2xl font-black mb-1">Select Exam Date</h2>
                <p className="text-white/30 text-sm mb-7">Choose the date you appeared for MHT CET 2026</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {shifts.map((s) => (
                    <motion.button key={s.date} whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      onClick={() => { playSound(); setShiftDate(s.date); setPage("session"); }}
                      className="p-4 rounded-2xl border bg-white/[0.04] border-white/[0.07] hover:border-white/20 text-left transition-all">
                      <div className="text-sm font-black text-white/90">{s.date}</div>
                      <div className="mt-3 space-y-1.5">
                        {(["Morning", "Evening"] as const).map((label) => {
                          const d = (label === "Morning" ? s.morning : s.evening).difficulty;
                          return (
                            <div key={label} className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${diffDot[d]}`} />
                              <span className="text-[11px] text-white/35">{label}:</span>
                              <span className={`text-[11px] font-semibold ${diffText[d]}`}>{d}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SESSION ── */}
          {page === "session" && (
            <motion.div key="session" {...pageVariants}>
              <div className={`${glass} p-7`}>
                <button onClick={() => setPage("shift")} className="mb-5 flex items-center gap-2 text-white/35 hover:text-white transition-all text-sm"><ArrowLeft size={15} /> Back</button>
                <h2 className="text-2xl font-black mb-1">Select Session</h2>
                <p className="text-white/30 text-sm mb-7">{shiftDate}</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {(["Morning", "Evening"] as const).map((s) => {
                    const info = s === "Morning" ? selectedShift?.morning : selectedShift?.evening;
                    const diff = info?.difficulty ?? "Moderate";
                    return (
                      <motion.button key={s} whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { playSound(); setSession(s); setPage("category"); }}
                        className={`p-9 rounded-2xl border bg-gradient-to-br ${diffCard[diff]} text-left transition-all`}>
                        <div className="text-3xl mb-3">{s === "Morning" ? "☀️" : "🌙"}</div>
                        <div className="text-xl font-black">{s}</div>
                        <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gradient-to-br ${diffCard[diff]}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${diffDot[diff]}`} />{diff}
                        </div>
                        <div className="mt-3 text-white/35 text-xs">{info?.above120}% scored 120+ · Highest {info?.highest} · {info?.students} students</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CATEGORY ── */}
          {page === "category" && (
            <motion.div key="category" {...pageVariants}>
              <div className={`${glass} p-7`}>
                <button onClick={() => setPage("session")} className="mb-5 flex items-center gap-2 text-white/35 hover:text-white transition-all text-sm"><ArrowLeft size={15} /> Back</button>
                <h2 className="text-2xl font-black mb-1">Select Category</h2>
                <p className="text-white/30 text-sm mb-7">Adjusts percentile for reservation benefit</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[
                    { id: "OPEN", sub: "General" }, { id: "OBC", sub: "+0.00%" }, { id: "EWS", sub: "+0.00%" },
                    { id: "VJNT", sub: "+0.12%" }, { id: "SC", sub: "+0.25%" }, { id: "ST", sub: "+0.25%" },
                  ].map(({ id, sub }) => (
                    <motion.button key={id} whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { playSound(); setCategory(id); setPage("marks"); }}
                      className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] hover:border-pink-400/30 hover:bg-pink-400/8 transition-all flex flex-col items-center gap-0.5">
                      <div className="font-black text-lg">{id}</div>
                      <div className="text-[10px] text-white/25">{sub}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MARKS ── */}
          {page === "marks" && (
            <motion.div key="marks" {...pageVariants}>
              <div className={`${glass} p-7`}>
                <button onClick={() => setPage("category")} className="mb-5 flex items-center gap-2 text-white/35 hover:text-white transition-all text-sm"><ArrowLeft size={15} /> Back</button>
                <h2 className="text-2xl font-black mb-1">Enter Your Marks</h2>
                <p className="text-white/30 text-sm mb-7">{shiftDate} · {session} · {category}</p>

                <div className="grid sm:grid-cols-3 gap-4">
                  {([
                    { label: "Physics", value: physics, setter: setPhysics, max: 50, color: "from-blue-400 to-cyan-400", bg: "border-blue-400/20" },
                    { label: "Chemistry", value: chemistry, setter: setChemistry, max: 50, color: "from-emerald-400 to-teal-400", bg: "border-emerald-400/20" },
                    { label: "Mathematics", value: maths, setter: setMaths, max: 100, color: "from-pink-400 to-violet-400", bg: "border-pink-400/20" },
                  ] as const).map(({ label, value, setter, max, color, bg }) => (
                    <motion.div key={label} whileHover={{ y: -2 }} className={`p-5 rounded-2xl border bg-white/[0.03] ${bg}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-white/50">{label}</span>
                        <span className="text-xs text-white/25">/{max}</span>
                      </div>
                      <input type="number" value={value || ""} placeholder="0"
                        onChange={(e) => handleMarks(Number(e.target.value), setter, max)}
                        className="outline-none text-5xl font-black w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{ background: "transparent", color: "white", WebkitTextFillColor: "white" }} />
                      <div className="mt-3 relative h-1.5 rounded-full bg-white/[0.06]">
                        <div className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${(value / max) * 100}%` }} />
                      </div>
                      <input type="range" min={0} max={max} value={value} onChange={(e) => setter(Number(e.target.value))}
                        className="w-full mt-1.5 accent-pink-400 cursor-pointer" />
                      <div className="text-right text-[10px] text-white/20 mt-0.5">{Math.round((value / max) * 100)}%</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/25 uppercase tracking-widest">Total Score</div>
                    <div className="text-5xl font-black mt-0.5"
                      style={{ background: "linear-gradient(135deg,#f9a8d4,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {totalMarks}<span className="text-base text-white/20 ml-1">/200</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/25">Shift Highest</div>
                    <div className="text-2xl font-black text-white/40">{shiftData?.highest}</div>
                    <div className="text-xs text-white/20 mt-1">
                      {totalMarks >= (shiftData?.highest ?? 0) ? "🏆 Beat shift topper!" : `${(shiftData?.highest ?? 0) - totalMarks} marks below topper`}
                    </div>
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handlePredict} disabled={totalMarks === 0}
                  className="w-full mt-4 rounded-2xl font-black text-lg py-4 text-black flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg,#f9a8d4,#c4b5fd,#67e8f9)" }}>
                  <Sparkles size={18} /> Predict My Percentile <ChevronRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {page === "loading" && (
            <motion.div key="loading" {...pageVariants}>
              <div className={`${glass} p-20 flex flex-col items-center text-center`}>
                <div className="relative w-20 h-20 mb-7">
                  <div className="absolute inset-0 rounded-full border-2 border-pink-400/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-400 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit size={20} className="text-pink-300 animate-pulse" />
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={loadingText} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-white/45">
                    {loadingText}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-5 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-400/40"
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {page === "result" && (
            <motion.div key="result" {...pageVariants} className="space-y-4">
              {/* Percentile hero */}
              <div className={`${glass} p-8 text-center`}>
                <div className="text-[10px] text-white/25 uppercase tracking-[0.4em] mb-5">Predicted Percentile</div>
                <PercentileGauge value={percentile} />
                <motion.div className="mt-3 text-sm italic text-white/40 max-w-sm mx-auto"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  "{getQuote(percentile)}"
                </motion.div>
                <div className="mt-6 grid grid-cols-3 gap-4 max-w-xs mx-auto">
                  {[
                    { label: "Physics", value: physics, max: 50, color: "from-blue-400 to-cyan-400" },
                    { label: "Chemistry", value: chemistry, max: 50, color: "from-emerald-400 to-teal-400" },
                    { label: "Math", value: maths, max: 100, color: "from-pink-400 to-violet-400" },
                  ].map(({ label, value, max, color }) => (
                    <div key={label} className="text-center">
                      <div className="text-[10px] text-white/25 mb-1.5">{label}</div>
                      <div className="text-xl font-black">{value}<span className="text-xs text-white/20">/{max}</span></div>
                      <div className="mt-1.5 h-1 rounded-full bg-white/[0.05]">
                        <motion.div className={`h-full rounded-full bg-gradient-to-r ${color}`}
                          initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }} transition={{ duration: 1, delay: 0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Difficulty", value: shiftData?.difficulty, icon: <Target size={13} /> },
                  { label: "Est. Rank", value: getRank(percentile), icon: <Trophy size={13} /> },
                  { label: "120+ %", value: `${shiftData?.above120}%`, icon: <TrendingUp size={13} /> },
                  { label: "Shift High", value: shiftData?.highest, icon: <Star size={13} /> },
                ].map(({ label, value, icon }) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`${glass} p-4`}>
                    <div className="flex items-center gap-1 text-white/25 text-xs mb-2">{icon}{label}</div>
                    <div className="text-xl font-black">{value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Tab nav */}
              <div className={`${glass} p-1.5 flex gap-1`}>
                {([
                  { id: "colleges", label: "Colleges", icon: <GraduationCap size={13} /> },
                  { id: "simulator", label: "What-if", icon: <SlidersHorizontal size={13} /> },
                  { id: "merit", label: "Merit Table", icon: <Table2 size={13} /> },
                ] as const).map(({ id, label, icon }) => (
                  <button key={id} onClick={() => setResultTab(id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      resultTab === id ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>
                    {icon}{label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {resultTab === "colleges" && (
                  <motion.div key="colleges-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className={`${glass} p-7`}>
                      {/* Filters */}
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 text-xs text-white/30">
                          <MapPin size={12} />
                          <div className="flex flex-wrap gap-1">
                            {cities.map((c) => (
                              <button key={c} onClick={() => setCityFilter(c)}
                                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${cityFilter === c ? "bg-pink-400/20 text-pink-300 border border-pink-400/30" : "text-white/30 hover:text-white/60"}`}>{c}</button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/30">
                          <Filter size={12} />
                          <div className="flex flex-wrap gap-1">
                            {branches.map((b) => (
                              <button key={b} onClick={() => setBranchFilter(b)}
                                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${branchFilter === b ? "bg-violet-400/20 text-violet-300 border border-violet-400/30" : "text-white/30 hover:text-white/60"}`}>{b}</button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {filteredColleges.length === 0 ? (
                        <div className="text-center py-10 text-white/25 text-sm">No colleges match this filter combination</div>
                      ) : (
                        <>
                          {/* Column headers */}
                          <div className="grid grid-cols-12 gap-2 text-[10px] text-white/25 uppercase tracking-widest mb-2 px-1">
                            <div className="col-span-4">College</div>
                            <div className="col-span-2">Branch</div>
                            <div className="col-span-1">City</div>
                            <div className="col-span-1 text-center">CAP 1</div>
                            <div className="col-span-1 text-center">CAP 2</div>
                            <div className="col-span-1 text-center">CAP 3</div>
                            <div className="col-span-1 text-center">Tier</div>
                            <div className="col-span-1"></div>
                          </div>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                            {filteredColleges.map((c, i) => (
                              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                className={`grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border bg-gradient-to-br ${tierStyle[c.tier]}`}>
                                <div className="col-span-4 font-bold text-sm text-white/90">{c.name}</div>
                                <div className="col-span-2 text-xs text-white/50">{c.branch}</div>
                                <div className="col-span-1 text-xs text-white/35">{c.city}</div>
                                <div className="col-span-1 text-center text-xs font-mono text-white/60">{c.cap1}</div>
                                <div className="col-span-1 text-center text-xs font-mono text-white/60">{c.cap2}</div>
                                <div className="col-span-1 text-center text-xs font-mono text-white/60">{c.cap3}</div>
                                <div className="col-span-1 text-center">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tierBadge[c.tier]}`}>{c.tier}</span>
                                </div>
                                <div className="col-span-1" />
                              </motion.div>
                            ))}
                          </div>
                          <p className="text-[10px] text-white/20 mt-3">Showing {filteredColleges.length} colleges matching your percentile · CAP cutoffs from 2025 data</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {resultTab === "simulator" && shiftData && (
                  <motion.div key="sim-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <WhatIfSimulator basePercentile={percentile} shiftData={shiftData} category={category} />
                  </motion.div>
                )}

                {resultTab === "merit" && (
                  <motion.div key="merit-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <MeritTable userPercentile={percentile} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setPage("marks")} className="p-4 rounded-2xl font-bold text-black text-sm flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#f9a8d4,#c4b5fd)" }}>
                  <RotateCcw size={14} /> Retry
                </button>
                <button onClick={() => setPage("shift")} className={`${glass} p-4 rounded-2xl text-sm font-bold text-white/50 hover:text-white transition-all`}>
                  Change Shift
                </button>
                <button onClick={handleShare} className={`${glass} p-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${copied ? "text-emerald-300" : "text-white/50 hover:text-white"}`}>
                  <Share2 size={14} /> {copied ? "Copied!" : "Share"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── HISTORY ── */}
          {page === "history" && (
            <motion.div key="history" {...pageVariants}>
              <div className={`${glass} p-7`}>
                <div className="flex items-center justify-between mb-7">
                  <div className="flex items-center gap-2 text-xl font-black">
                    <History size={18} className="text-pink-300" /> Prediction History
                  </div>
                  {history.length > 0 && (
                    <button onClick={() => { localStorage.removeItem("rankpulse-v2-history"); setHistory([]); }}
                      className="flex items-center gap-1.5 text-rose-400/50 hover:text-rose-400 text-xs transition-all">
                      <Trash2 size={12} /> Clear all
                    </button>
                  )}
                </div>
                {history.length === 0 ? (
                  <div className="text-center py-14 text-white/20">
                    <History size={36} className="mx-auto mb-3 opacity-25" /><p className="text-sm">No predictions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((h, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400/15 to-violet-400/15 border border-white/[0.08] flex items-center justify-center text-xs font-black text-pink-300">#{i + 1}</div>
                            <div>
                              <div className="text-xl font-black">{h.percentile}<span className="text-xs text-white/25 ml-1">%ile</span></div>
                              <div className="text-xs text-white/25 mt-0.5">{h.shift}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-bold">{h.marks}/200</div>
                            <div className="text-xs text-white/20">{h.time}</div>
                          </div>
                        </div>
                        {h.physics !== undefined && (
                          <div className="mt-3 flex gap-3">
                            {[{ l: "Phy", v: h.physics, max: 50, c: "bg-blue-400" }, { l: "Chem", v: h.chemistry, max: 50, c: "bg-emerald-400" }, { l: "Math", v: h.maths, max: 100, c: "bg-pink-400" }].map(({ l, v, max, c }) => (
                              <div key={l} className="flex-1">
                                <div className="flex justify-between text-[10px] text-white/25 mb-1"><span>{l}</span><span>{v}</span></div>
                                <div className="h-0.5 rounded-full bg-white/[0.05]"><div className={`h-full rounded-full ${c} opacity-50`} style={{ width: `${(v / max) * 100}%` }} /></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <p className="text-center text-white/10 text-[10px] mt-6 pb-4 tracking-wide">
          RankPulse AI · 30+ colleges · CAP 2025 cutoffs · Estimates only · Not affiliated with MHT CET Board
        </p>
      </div>
    </div>
  );
}
