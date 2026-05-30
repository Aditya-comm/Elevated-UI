import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  GraduationCap,
  BarChart3,
  History,
  Volume2,
  VolumeX,
  ChevronRight,
  ArrowLeft,
  Trophy,
  Share2,
  RotateCcw,
  Trash2,
  TrendingUp,
  Zap,
  Star,
  Target,
  Filter,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Page = "intro" | "shift" | "session" | "category" | "marks" | "loading" | "result" | "history";

interface ShiftInfo {
  difficulty: "Easy" | "Moderate" | "Hard";
  above120: number;
  highest: number;
  students: number;
}

interface Shift {
  date: string;
  morning: ShiftInfo;
  evening: ShiftInfo;
}

interface HistoryEntry {
  percentile: string;
  marks: number;
  shift: string;
  time: string;
  physics: number;
  chemistry: number;
  maths: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

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

const diffColor: Record<string, string> = {
  Easy: "from-emerald-400/20 to-emerald-400/5 border-emerald-400/30 text-emerald-300",
  Moderate: "from-amber-400/20 to-amber-400/5 border-amber-400/30 text-amber-300",
  Hard: "from-rose-400/20 to-rose-400/5 border-rose-400/30 text-rose-300",
};

const diffDot: Record<string, string> = {
  Easy: "bg-emerald-400",
  Moderate: "bg-amber-400",
  Hard: "bg-rose-400",
};

const STEPS = ["Shift", "Session", "Category", "Marks"];
const stepMap: Record<Page, number> = { intro: -1, shift: 0, session: 1, category: 2, marks: 3, loading: 4, result: 4, history: -1 };

// ─── Percentile Engine ───────────────────────────────────────────────────────

function calcPercentile(totalMarks: number, shiftData: ShiftInfo, category: string): number {
  const diff = shiftData.difficulty;
  let base = 0;

  if (diff === "Hard") {
    if (totalMarks >= 150) base = 99.86 + (totalMarks - 150) * 0.006;
    else if (totalMarks >= 140) base = 99.55 + (totalMarks - 140) * 0.031;
    else if (totalMarks >= 130) base = 99.15 + (totalMarks - 130) * 0.04;
    else if (totalMarks >= 120) base = 98.70 + (totalMarks - 120) * 0.045;
    else if (totalMarks >= 110) base = 97.80 + (totalMarks - 110) * 0.09;
    else if (totalMarks >= 100) base = 96.60 + (totalMarks - 100) * 0.12;
    else if (totalMarks >= 90) base = 94.90 + (totalMarks - 90) * 0.17;
    else base = 80 + totalMarks * 0.16;
  } else if (diff === "Moderate") {
    if (totalMarks >= 150) base = 99.76 + (totalMarks - 150) * 0.005;
    else if (totalMarks >= 140) base = 99.42 + (totalMarks - 140) * 0.034;
    else if (totalMarks >= 130) base = 98.98 + (totalMarks - 130) * 0.044;
    else if (totalMarks >= 120) base = 98.42 + (totalMarks - 120) * 0.056;
    else if (totalMarks >= 110) base = 97.45 + (totalMarks - 110) * 0.097;
    else if (totalMarks >= 100) base = 96.20 + (totalMarks - 100) * 0.125;
    else if (totalMarks >= 90) base = 94.50 + (totalMarks - 90) * 0.17;
    else base = 79 + totalMarks * 0.17;
  } else {
    if (totalMarks >= 150) base = 99.68 + (totalMarks - 150) * 0.004;
    else if (totalMarks >= 140) base = 99.30 + (totalMarks - 140) * 0.038;
    else if (totalMarks >= 130) base = 98.78 + (totalMarks - 130) * 0.052;
    else if (totalMarks >= 120) base = 98.05 + (totalMarks - 120) * 0.073;
    else if (totalMarks >= 110) base = 97.00 + (totalMarks - 110) * 0.105;
    else if (totalMarks >= 100) base = 95.60 + (totalMarks - 100) * 0.14;
    else if (totalMarks >= 90) base = 93.60 + (totalMarks - 90) * 0.20;
    else base = 78 + totalMarks * 0.17;
  }

  if (category === "SC" || category === "ST") base += 0.25;
  if (category === "VJNT") base += 0.12;
  if (shiftData.above120 < 5) base += 0.15;

  return Math.min(base, 99.99);
}

function getRank(p: number): string {
  if (p >= 99.8) return "< 500";
  if (p >= 99.5) return "500 – 1.5k";
  if (p >= 99) return "1.5k – 3k";
  if (p >= 98) return "3k – 6k";
  if (p >= 97) return "6k – 10k";
  if (p >= 95) return "10k – 18k";
  return "18k+";
}

function getQuote(p: number): string {
  if (p >= 99.5) return "Maharashtra's best just looked in the mirror.";
  if (p >= 99) return "You survived the academic battle royale.";
  if (p >= 97) return "Not perfection. Still dangerous.";
  if (p >= 95) return "Consistency beats panic. Every time.";
  return "One exam never gets the final vote.";
}

// ─── Colleges Data ───────────────────────────────────────────────────────────

interface College {
  tier: "Dream" | "Strong" | "Safe";
  name: string;
  branch: string;
  cutoff: string;
}

function getColleges(p: number): College[] {
  if (p >= 99)
    return [
      { tier: "Dream", name: "COEP Pune", branch: "ENTC", cutoff: "99.3+" },
      { tier: "Dream", name: "VJTI Mumbai", branch: "Mechanical", cutoff: "99.4+" },
      { tier: "Dream", name: "COEP Pune", branch: "CS", cutoff: "99.5+" },
      { tier: "Strong", name: "PICT Pune", branch: "IT", cutoff: "99+" },
      { tier: "Strong", name: "WCE Sangli", branch: "ENTC", cutoff: "98.8+" },
      { tier: "Safe", name: "VIT Pune", branch: "CS", cutoff: "98+" },
    ];
  if (p >= 98)
    return [
      { tier: "Strong", name: "WCE Sangli", branch: "ENTC", cutoff: "98+" },
      { tier: "Strong", name: "VIT Pune", branch: "CS", cutoff: "97.8+" },
      { tier: "Strong", name: "PICT Pune", branch: "Mechanical", cutoff: "97.5+" },
      { tier: "Safe", name: "PCCOE", branch: "CS", cutoff: "97+" },
      { tier: "Safe", name: "Walchand", branch: "Mechanical", cutoff: "96+" },
    ];
  return [
    { tier: "Safe", name: "Walchand", branch: "Mechanical", cutoff: "95+" },
    { tier: "Safe", name: "VIT Pune", branch: "ENTC", cutoff: "95+" },
    { tier: "Safe", name: "PCCOE", branch: "Mechanical", cutoff: "94+" },
    { tier: "Safe", name: "STES Pune", branch: "IT", cutoff: "93+" },
  ];
}

const tierStyle: Record<string, string> = {
  Dream: "from-violet-500/20 to-pink-500/20 border-violet-400/30",
  Strong: "from-blue-500/20 to-cyan-500/20 border-blue-400/30",
  Safe: "from-emerald-500/20 to-teal-500/20 border-emerald-400/30",
};
const tierBadge: Record<string, string> = {
  Dream: "bg-violet-400/20 text-violet-300 border-violet-400/30",
  Strong: "bg-blue-400/20 text-blue-300 border-blue-400/30",
  Safe: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
};

// ─── Gauge Component ─────────────────────────────────────────────────────────

function PercentileGauge({ value }: { value: number }) {
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const arc = circumference * 0.75;
  const offset = arc - (value / 100) * arc;

  const getColor = () => {
    if (value >= 99) return "#c084fc";
    if (value >= 97) return "#60a5fa";
    if (value >= 95) return "#34d399";
    return "#fb923c";
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg width={radius * 2} height={radius * 2} className="-rotate-[135deg]">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference - arc}`}
          strokeLinecap="round"
        />
        <motion.circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={getColor()}
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference - arc}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${getColor()})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="text-5xl font-black bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value.toFixed(2)}
        </motion.div>
        <div className="text-xs text-white/40 tracking-widest uppercase mt-1">percentile</div>
      </div>
    </div>
  );
}

// ─── Confetti ────────────────────────────────────────────────────────────────

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#f472b6", "#818cf8", "#34d399", "#fb923c", "#60a5fa"][Math.floor(Math.random() * 5)],
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: p.color, top: -20 }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)], opacity: [1, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// ─── Step Progress ────────────────────────────────────────────────────────────

function StepProgress({ currentStep }: { currentStep: number }) {
  if (currentStep < 0) return null;
  return (
    <div className="flex items-center gap-2 justify-center py-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                i < currentStep
                  ? "bg-gradient-to-br from-pink-400 to-violet-400 text-white"
                  : i === currentStep
                  ? "bg-white/20 border-2 border-pink-400 text-white"
                  : "bg-white/5 border border-white/10 text-white/30"
              }`}
              animate={{ scale: i === currentStep ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: i === currentStep ? Infinity : 0, duration: 2 }}
            >
              {i < currentStep ? "✓" : i + 1}
            </motion.div>
            <span className={`text-[10px] tracking-wide ${i <= currentStep ? "text-white/60" : "text-white/20"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px mb-4 transition-all duration-500 ${i < currentStep ? "bg-pink-400/60" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Glass Utility ────────────────────────────────────────────────────────────

const glass = "bg-white/[0.04] backdrop-blur-3xl border border-white/[0.08] rounded-[32px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_80px_rgba(0,0,0,0.4)]";

// ─── Main Component ───────────────────────────────────────────────────────────

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
  const [branchFilter, setBranchFilter] = useState("All");
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
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
    audio.volume = 0.12;
    audio.play().catch(() => {});
  };

  const handleMarks = (value: number, setter: (v: number) => void, max: number) => {
    const clamped = Math.max(0, Math.min(max, value));
    setter(isNaN(clamped) ? 0 : clamped);
  };

  const handlePredict = () => {
    if (!shiftData) return;
    playSound();
    setPage("loading");

    const texts = [
      "Matching 2026 normalization data...",
      "Analyzing percentile density...",
      "Comparing difficulty patterns...",
      "Generating rank estimates...",
    ];
    let i = 0;
    const textInterval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 1100);

    const target = calcPercentile(totalMarks, shiftData, category);
    let current = 0;
    const interval = setInterval(() => {
      current += 0.18;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        clearInterval(textInterval);

        const entry: HistoryEntry = {
          percentile: target.toFixed(2),
          marks: totalMarks,
          shift: shiftDate + " " + session,
          time: new Date().toLocaleString(),
          physics,
          chemistry,
          maths,
        };
        const updated = [entry, ...history].slice(0, 10);
        localStorage.setItem("rankpulse-v2-history", JSON.stringify(updated));
        setHistory(updated);

        setTimeout(() => {
          setPage("result");
          if (target >= 99) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }, 400);
      }
      setPercentile(current);
    }, 8);
  };

  const handleShare = () => {
    const text = `🎯 RankPulse AI Prediction\nPercentile: ${percentile.toFixed(2)}\nMarks: ${totalMarks}/200\nShift: ${shiftDate} ${session}\nEstimated Rank: ${getRank(percentile)}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const allColleges = useMemo(() => getColleges(percentile), [percentile]);
  const branches = useMemo(() => ["All", ...Array.from(new Set(allColleges.map((c) => c.branch)))], [allColleges]);
  const filteredColleges = branchFilter === "All" ? allColleges : allColleges.filter((c) => c.branch === branchFilter);

  const pageVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  return (
    <div className="min-h-screen bg-[#06030f] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -left-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(192,38,211,0.12) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)" }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {showConfetti && <Confetti />}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        {/* Navbar */}
        <div className={`${glass} px-6 py-3.5 flex items-center justify-between sticky top-4 z-50 mb-2`}>
          <button onClick={() => setPage("intro")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center">
              <BrainCircuit size={16} className="text-pink-300" />
            </div>
            <span className="font-black text-lg tracking-tight">RankPulse<span className="text-pink-300"> AI</span></span>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage("history")} className="px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5">
              <History size={14} />
              <span>History</span>
              {history.length > 0 && <span className="w-4 h-4 rounded-full bg-pink-400/30 text-pink-300 text-[10px] flex items-center justify-center">{history.length}</span>}
            </button>
            <button onClick={() => setSound(!sound)} className="w-8 h-8 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
              {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
          </div>
        </div>

        <StepProgress currentStep={stepMap[page]} />

        <AnimatePresence mode="wait">
          {/* INTRO */}
          {page === "intro" && (
            <motion.div key="intro" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0], y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center mb-8"
              >
                <BrainCircuit size={44} className="text-pink-300" />
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter"
                style={{ background: "linear-gradient(135deg, #f9a8d4 0%, #c4b5fd 50%, #67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                RankPulse AI
              </h1>

              <p className="mt-3 text-white/30 tracking-[0.4em] uppercase text-xs font-medium">MHT CET 2026 · Percentile Predictor</p>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm">
                {[
                  { icon: Target, label: "Accurate", sub: "Normalization-aware" },
                  { icon: Zap, label: "Instant", sub: "Real-time calc" },
                  { icon: Star, label: "Smart", sub: "Category-adjusted" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className={`${glass} p-4 flex flex-col items-center gap-1`}>
                    <Icon size={18} className="text-pink-300" />
                    <div className="text-xs font-bold text-white/80">{label}</div>
                    <div className="text-[10px] text-white/30 text-center">{sub}</div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { playSound(); setPage("shift"); }}
                className="mt-10 px-10 py-4 rounded-2xl font-black text-black flex items-center gap-2.5"
                style={{ background: "linear-gradient(135deg, #f9a8d4, #c4b5fd, #67e8f9)" }}
              >
                <Sparkles size={18} />
                Begin Analysis
                <ChevronRight size={18} />
              </motion.button>

              <p className="mt-6 text-white/20 text-xs">8 exam dates · 16 shifts · Category-adjusted predictions</p>
            </motion.div>
          )}

          {/* SHIFT */}
          {page === "shift" && (
            <motion.div key="shift" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className={`${glass} p-8`}>
                <h2 className="text-3xl font-black mb-1">Select Your Exam Date</h2>
                <p className="text-white/30 text-sm mb-8">Choose the date you appeared for MHT CET 2026</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {shifts.map((s) => (
                    <motion.button
                      key={s.date}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { playSound(); setShiftDate(s.date); setPage("session"); }}
                      className="p-5 rounded-2xl border bg-gradient-to-br from-white/[0.04] to-white/[0.01] border-white/[0.07] hover:border-white/20 text-left transition-all group"
                    >
                      <div className="text-sm font-black text-white/90">{s.date}</div>
                      <div className="mt-3 space-y-1.5">
                        {[["Morning", s.morning], ["Evening", s.evening]].map(([label, info]) => {
                          const d = (info as ShiftInfo).difficulty;
                          return (
                            <div key={label as string} className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${diffDot[d]}`} />
                              <span className="text-[11px] text-white/40">{label as string}:</span>
                              <span className={`text-[11px] font-semibold ${d === "Easy" ? "text-emerald-300" : d === "Moderate" ? "text-amber-300" : "text-rose-300"}`}>{d}</span>
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

          {/* SESSION */}
          {page === "session" && (
            <motion.div key="session" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className={`${glass} p-8`}>
                <button onClick={() => setPage("shift")} className="mb-6 flex items-center gap-2 text-white/40 hover:text-white transition-all text-sm">
                  <ArrowLeft size={16} /> Back
                </button>
                <h2 className="text-3xl font-black mb-1">Select Session</h2>
                <p className="text-white/30 text-sm mb-8">
                  {shiftDate} · {selectedShift?.morning.difficulty} morning / {selectedShift?.evening.difficulty} evening
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {(["Morning", "Evening"] as const).map((s) => {
                    const info = s === "Morning" ? selectedShift?.morning : selectedShift?.evening;
                    const diff = info?.difficulty ?? "Moderate";
                    return (
                      <motion.button
                        key={s}
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { playSound(); setSession(s); setPage("category"); }}
                        className={`p-10 rounded-2xl border bg-gradient-to-br ${diffColor[diff]} text-left transition-all`}
                      >
                        <div className="text-4xl mb-4">{s === "Morning" ? "☀️" : "🌙"}</div>
                        <div className="text-2xl font-black">{s}</div>
                        <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-gradient-to-br ${diffColor[diff]}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${diffDot[diff]}`} />
                          {diff}
                        </div>
                        <div className="mt-3 text-white/40 text-sm">{info?.above120}% scored 120+</div>
                        <div className="text-white/30 text-xs mt-1">{info?.students} students · Highest {info?.highest}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* CATEGORY */}
          {page === "category" && (
            <motion.div key="category" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className={`${glass} p-8`}>
                <button onClick={() => setPage("session")} className="mb-6 flex items-center gap-2 text-white/40 hover:text-white transition-all text-sm">
                  <ArrowLeft size={16} /> Back
                </button>
                <h2 className="text-3xl font-black mb-1">Select Category</h2>
                <p className="text-white/30 text-sm mb-8">Your reservation category for cutoff adjustment</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[
                    { id: "OPEN", label: "Open", sub: "General" },
                    { id: "OBC", label: "OBC", sub: "+0.00%" },
                    { id: "EWS", label: "EWS", sub: "+0.00%" },
                    { id: "VJNT", label: "VJNT", sub: "+0.12%" },
                    { id: "SC", label: "SC", sub: "+0.25%" },
                    { id: "ST", label: "ST", sub: "+0.25%" },
                  ].map(({ id, label, sub }) => (
                    <motion.button
                      key={id}
                      whileHover={{ y: -2, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { playSound(); setCategory(id); setPage("marks"); }}
                      className="p-4 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.01] hover:border-pink-400/30 hover:from-pink-400/10 transition-all flex flex-col items-center gap-1"
                    >
                      <div className="font-black text-lg">{label}</div>
                      <div className="text-[10px] text-white/30">{sub}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* MARKS */}
          {page === "marks" && (
            <motion.div key="marks" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className={`${glass} p-8`}>
                <button onClick={() => setPage("category")} className="mb-6 flex items-center gap-2 text-white/40 hover:text-white transition-all text-sm">
                  <ArrowLeft size={16} /> Back
                </button>
                <h2 className="text-3xl font-black mb-1">Enter Your Marks</h2>
                <p className="text-white/30 text-sm mb-8">{shiftDate} · {session} · {category}</p>

                <div className="grid sm:grid-cols-3 gap-5">
                  {([
                    { label: "Physics", value: physics, setter: setPhysics, max: 50, color: "from-blue-400 to-cyan-400", bg: "from-blue-400/10 to-cyan-400/5 border-blue-400/20" },
                    { label: "Chemistry", value: chemistry, setter: setChemistry, max: 50, color: "from-emerald-400 to-teal-400", bg: "from-emerald-400/10 to-teal-400/5 border-emerald-400/20" },
                    { label: "Mathematics", value: maths, setter: setMaths, max: 100, color: "from-pink-400 to-violet-400", bg: "from-pink-400/10 to-violet-400/5 border-pink-400/20" },
                  ] as const).map(({ label, value, setter, max, color, bg }) => (
                    <motion.div key={label} whileHover={{ y: -2 }}
                      className={`p-6 rounded-2xl border bg-gradient-to-br ${bg}`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-white/60">{label}</span>
                        <span className="text-xs text-white/30">/ {max}</span>
                      </div>
                      <input
                        type="number"
                        value={value || ""}
                        placeholder="0"
                        onChange={(e) => handleMarks(Number(e.target.value), setter, max)}
                        className="outline-none text-5xl font-black w-full placeholder-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{ background: "transparent", color: "white", WebkitTextFillColor: "white" }}
                      />
                      <div className="mt-4 relative">
                        <div className="w-full h-1.5 rounded-full bg-white/5">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${color}`}
                            style={{ width: `${(value / max) * 100}%` }}
                            layout
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={max}
                          value={value}
                          onChange={(e) => setter(Number(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5"
                        />
                      </div>
                      <div className="mt-2 text-right text-[10px] text-white/25">{Math.round((value / max) * 100)}%</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/30 uppercase tracking-widest">Total Score</div>
                    <div className="text-5xl font-black mt-1"
                      style={{ background: "linear-gradient(135deg, #f9a8d4, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {totalMarks}
                      <span className="text-xl text-white/20 ml-2">/200</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/30">Shift Highest</div>
                    <div className="text-2xl font-black text-white/50">{shiftData?.highest}</div>
                    <div className="text-xs text-white/25 mt-1">
                      {totalMarks >= (shiftData?.highest ?? 0) ? "🏆 Above shift topper!" : `${(shiftData?.highest ?? 0) - totalMarks} below topper`}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePredict}
                  disabled={totalMarks === 0}
                  className="w-full mt-5 rounded-2xl font-black text-lg py-4 text-black flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #f9a8d4, #c4b5fd, #67e8f9)" }}
                >
                  <Sparkles size={20} />
                  Predict My Percentile
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* LOADING */}
          {page === "loading" && (
            <motion.div key="loading" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className={`${glass} p-20 flex flex-col items-center text-center`}>
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-2 border-pink-400/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-400 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit size={24} className="text-pink-300 animate-pulse" />
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={loadingText}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="text-white/50 text-lg">
                    {loadingText}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-6 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-400/50"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {page === "result" && (
            <motion.div key="result" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
              {/* Main percentile card */}
              <div className={`${glass} p-10 text-center`}>
                <div className="text-xs text-white/30 uppercase tracking-[0.4em] mb-6">Predicted Percentile</div>
                <PercentileGauge value={percentile} />
                <motion.div
                  className="mt-4 text-base italic text-white/50 max-w-md mx-auto"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  "{getQuote(percentile)}"
                </motion.div>

                {/* Subject breakdown */}
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  {[
                    { label: "Physics", value: physics, max: 50, color: "from-blue-400 to-cyan-400" },
                    { label: "Chemistry", value: chemistry, max: 50, color: "from-emerald-400 to-teal-400" },
                    { label: "Math", value: maths, max: 100, color: "from-pink-400 to-violet-400" },
                  ].map(({ label, value, max, color }) => (
                    <div key={label} className="text-center">
                      <div className="text-xs text-white/30 mb-2">{label}</div>
                      <div className="text-2xl font-black">{value}</div>
                      <div className="text-xs text-white/20">/{max}</div>
                      <div className="mt-2 h-1 rounded-full bg-white/5">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / max) * 100}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Difficulty", value: shiftData?.difficulty, icon: <Target size={14} /> },
                  { label: "Est. Rank", value: getRank(percentile), icon: <Trophy size={14} /> },
                  { label: "120+ %", value: `${shiftData?.above120}%`, icon: <TrendingUp size={14} /> },
                  { label: "Shift High", value: shiftData?.highest, icon: <Star size={14} /> },
                ].map(({ label, value, icon }) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className={`${glass} p-5`}>
                    <div className="flex items-center gap-1.5 text-white/30 text-xs mb-3">{icon}{label}</div>
                    <div className="text-2xl font-black">{value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Marks vs Shift chart */}
              <div className={`${glass} p-8`}>
                <div className="flex items-center gap-2 text-lg font-black mb-6">
                  <BarChart3 size={18} className="text-pink-300" /> Score Comparison
                </div>
                <div className="flex items-end gap-2 h-32">
                  {[
                    { label: "Your", value: totalMarks, max: 200, color: "from-pink-400 to-violet-400", highlight: true },
                    { label: "Highest", value: shiftData?.highest ?? 0, max: 200, color: "from-white/20 to-white/5", highlight: false },
                    { label: "120+ avg", value: Math.round((shiftData?.above120 ?? 0) * 1.4 + 118), max: 200, color: "from-white/10 to-white/[0.03]", highlight: false },
                  ].map(({ label, value, max, color, highlight }) => (
                    <div key={label} className="flex flex-col items-center gap-2 flex-1">
                      <div className="text-xs text-white/40">{value}</div>
                      <div className="w-full rounded-t-xl relative overflow-hidden"
                        style={{ height: `${(value / max) * 100}%`, minHeight: "8px" }}>
                        <div className={`absolute inset-0 bg-gradient-to-t ${color} ${highlight ? "animate-pulse" : ""}`} />
                      </div>
                      <div className={`text-[10px] ${highlight ? "text-pink-300 font-bold" : "text-white/30"}`}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colleges */}
              <div className={`${glass} p-8`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-lg font-black">
                    <GraduationCap size={18} className="text-pink-300" /> Predicted Colleges
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Filter size={12} />
                    <div className="flex gap-1">
                      {branches.map((b) => (
                        <button key={b}
                          onClick={() => setBranchFilter(b)}
                          className={`px-2.5 py-1 rounded-lg transition-all ${branchFilter === b ? "bg-pink-400/20 text-pink-300 border border-pink-400/30" : "text-white/30 hover:text-white/60"}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredColleges.map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className={`p-5 rounded-2xl border bg-gradient-to-br ${tierStyle[c.tier]}`}>
                      <div className="flex items-start justify-between">
                        <div className="font-black text-lg">{c.name}</div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tierBadge[c.tier]}`}>{c.tier}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-sm text-white/50">
                        <span>{c.branch}</span>
                        <span className="text-white/20">·</span>
                        <span>Cutoff {c.cutoff}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => setPage("marks")}
                  className="p-4 rounded-2xl font-bold text-black text-sm flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #f9a8d4, #c4b5fd)" }}>
                  <RotateCcw size={15} /> Retry
                </button>
                <button onClick={() => setPage("shift")}
                  className={`${glass} p-4 rounded-2xl text-sm font-bold text-white/60 hover:text-white transition-all`}>
                  Change Shift
                </button>
                <button onClick={handleShare}
                  className={`${glass} p-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${copied ? "text-emerald-300" : "text-white/60 hover:text-white"}`}>
                  <Share2 size={15} /> {copied ? "Copied!" : "Share"}
                </button>
              </div>
            </motion.div>
          )}

          {/* HISTORY */}
          {page === "history" && (
            <motion.div key="history" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className={`${glass} p-8`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-2xl font-black">
                    <History size={20} className="text-pink-300" /> Prediction History
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={() => { localStorage.removeItem("rankpulse-v2-history"); setHistory([]); }}
                      className="flex items-center gap-1.5 text-rose-400/60 hover:text-rose-400 text-xs transition-all">
                      <Trash2 size={13} /> Clear
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-16 text-white/20">
                    <History size={40} className="mx-auto mb-4 opacity-30" />
                    <p>No predictions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((h, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-5 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-xs font-black text-pink-300">
                              #{i + 1}
                            </div>
                            <div>
                              <div className="text-2xl font-black">{h.percentile}<span className="text-sm text-white/30 ml-1">%ile</span></div>
                              <div className="text-xs text-white/30 mt-0.5">{h.shift}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{h.marks}/200</div>
                            <div className="text-xs text-white/25 mt-0.5">{h.time}</div>
                          </div>
                        </div>
                        {(h.physics !== undefined) && (
                          <div className="mt-4 flex gap-3">
                            {[
                              { l: "Phy", v: h.physics, max: 50, c: "bg-blue-400" },
                              { l: "Chem", v: h.chemistry, max: 50, c: "bg-emerald-400" },
                              { l: "Math", v: h.maths, max: 100, c: "bg-pink-400" },
                            ].map(({ l, v, max, c }) => (
                              <div key={l} className="flex-1">
                                <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>{l}</span><span>{v}</span></div>
                                <div className="h-1 rounded-full bg-white/5"><div className={`h-full rounded-full ${c} opacity-60`} style={{ width: `${(v / max) * 100}%` }} /></div>
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

        {/* Footer */}
        <p className="text-center text-white/15 text-[10px] mt-8 pb-4 tracking-wide">
          RankPulse AI · Estimates based on 2025 normalization patterns · Not official
        </p>
      </div>
    </div>
  );
}
