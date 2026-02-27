import React, { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useSpring,
  AnimatePresence,
} from "framer-motion";

// --- REFINED 3D SPHERE ---
const ThemeSphere = ({
  title,
  isActive,
  x,
  y,
  themeColor,
  onSelect,
  isFront,
}) => {
  const colorMap = {
    emerald: {
      bg: "from-white via-emerald-50 to-emerald-200/60",
      shadow: "rgba(16,185,129,0.4)",
      text: "text-emerald-950",
    },
    ruby: {
      bg: "from-white via-rose-50 to-rose-200/60",
      shadow: "rgba(225,29,72,0.4)",
      text: "text-rose-950",
    },
    amber: {
      bg: "from-white via-amber-50 to-amber-200/60",
      shadow: "rgba(245,158,11,0.4)",
      text: "text-amber-950",
    },
  };
  const style = colorMap[themeColor];

  return (
    <motion.div
      style={{ x, y, zIndex: isFront ? 100 : 50 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`absolute cursor-pointer transition-opacity duration-700 ${
        isActive ? "opacity-100" : "opacity-20"
      }`}
    >
      <div
        className={`w-56 h-56 rounded-full relative flex items-center justify-center bg-gradient-to-br ${style.bg} border-t-[3px] border-l-[3px] border-white/90 shadow-2xl backdrop-blur-3xl`}
      >
        <div className="absolute top-6 left-10 w-20 h-10 bg-white/60 rounded-[100%] blur-xl rotate-[-25deg]" />
        <p
          className={`text-[13px] font-black uppercase tracking-[0.3em] ${style.text} text-center px-4`}
        >
          {title}
        </p>
      </div>
    </motion.div>
  );
};

export default function OmnipositoryUI() {
  const [view, setView] = useState("platform"); // "platform" or "unipository"
  const [activeTheme, setActiveTheme] = useState(null);
  const containerRef = useRef(null);

  // Physics Values
  const s1X = useMotionValue(-150);
  const s1Y = useMotionValue(-100);
  const s2X = useMotionValue(180);
  const s2Y = useMotionValue(20);
  const s3X = useMotionValue(-20);
  const s3Y = useMotionValue(150);

  const zoomScale = useSpring(view === "platform" ? 0.6 : 1.2, {
    stiffness: 50,
    damping: 25,
  });

  useAnimationFrame(() => {
    if (view !== "platform") return;
    const spheres = [
      { x: s1X, y: s1Y },
      { x: s2X, y: s2Y },
      { x: s3X, y: s3Y },
    ];
    // Simple collision logic to keep them floating/bouncing
    for (let i = 0; i < spheres.length; i++) {
      for (let j = i + 1; j < spheres.length; j++) {
        const dx = spheres[i].x.get() - spheres[j].x.get();
        const dy = spheres[i].y.get() - spheres[j].y.get();
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 240 && d > 0) {
          const overlap = (240 - d) * 0.05;
          spheres[i].x.set(spheres[i].x.get() + (dx / d) * overlap);
          spheres[j].x.set(spheres[j].x.get() - (dx / d) * overlap);
        }
      }
    }
  });

  return (
    <div className="h-screen w-screen bg-[#fcfdfe] overflow-hidden relative font-sans text-sky-950">
      {/* Visual Platform Layer */}
      <AnimatePresence>
        {view === "platform" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#e0f2fe_0%,#f8fafc_100%)]" />
            <motion.div
              style={{ scale: zoomScale }}
              ref={containerRef}
              className="relative w-full h-full flex items-center justify-center"
            >
              <ThemeSphere
                title="Organization"
                themeColor="emerald"
                isActive={true}
                x={s1X}
                y={s1Y}
                onSelect={() => {
                  setActiveTheme("Organization");
                  setView("unipository");
                }}
              />
              <ThemeSphere
                title="Systems"
                themeColor="ruby"
                isActive={true}
                x={s2X}
                y={s2Y}
                onSelect={() => {
                  setActiveTheme("Systems");
                  setView("unipository");
                }}
              />
              <ThemeSphere
                title="Terminology"
                themeColor="amber"
                isActive={true}
                x={s3X}
                y={s3Y}
                onSelect={() => {
                  setActiveTheme("Terminology");
                  setView("unipository");
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unipository Layer (Based on your sketch) */}
      <AnimatePresence>
        {view === "unipository" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col p-6 bg-white"
          >
            {/* Top Nav: Vertical Navigation */}
            <header className="h-20 border-b flex items-center justify-between px-10 mb-6">
              <button
                onClick={() => setView("platform")}
                className="text-[10px] font-black tracking-widest uppercase opacity-30 hover:opacity-100 transition-opacity"
              >
                ← Back to Platform
              </button>
              <div className="text-[11px] font-bold uppercase tracking-[0.5em]">
                Vertical Navigation (Levels)
              </div>
              <div className="w-10 h-10 border rounded-full flex items-center justify-center opacity-20">
                🧭
              </div>
            </header>

            {/* History Bridge */}
            <div className="flex justify-center items-center gap-4 mb-6 opacity-40">
              <div className="text-[9px] font-bold uppercase tracking-widest">
                History Bridge / "The Path"
              </div>
              <div className="h-[1px] w-48 bg-sky-950/20 flex justify-around">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-950 mt-[-2px]" />
                <div className="w-1.5 h-1.5 rounded-full bg-sky-950 mt-[-2px]" />
              </div>
            </div>

            {/* Main Study Area */}
            <main className="flex-1 flex gap-6 px-4">
              <div className="flex-1 bg-sky-50/50 rounded-[4rem] border border-sky-100 shadow-inner relative flex items-center justify-center overflow-hidden">
                <div className="absolute bottom-10 left-12 text-[10px] font-bold uppercase tracking-widest opacity-40">
                  Conditions
                </div>
                <div className="text-sky-900/20 text-4xl font-black uppercase tracking-[1em]">
                  {activeTheme} Pane
                </div>
                <div className="absolute bottom-10 right-12 text-[10px] font-bold uppercase tracking-widest opacity-40">
                  Study Tools
                </div>
              </div>
            </main>

            {/* Bottom Nav: Themes */}
            <footer className="h-24 mt-6 border-t flex items-center justify-center">
              <div className="text-[11px] font-bold uppercase tracking-[0.5em] opacity-40">
                Horizontal Navigation (Themes within levels)
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
