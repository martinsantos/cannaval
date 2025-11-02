import React from 'react';

const HUD: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none text-white font-display">
      {/* Top Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-between whitespace-nowrap rounded-full p-2 bg-background-dark/80 backdrop-blur-sm border border-slate-800/50 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pl-3">
            <span className="material-symbols-outlined text-orange-500 text-2xl">light_mode</span>
            <div className="flex flex-col items-start">
              <p className="font-bold text-sm leading-tight text-slate-50">Sunny</p>
              <p className="text-xs font-normal leading-tight text-slate-400">Summer</p>
            </div>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-700 mx-4"></div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-400 text-2xl">nightlight</span>
          <div className="flex flex-col items-start">
            <p className="font-bold text-sm leading-tight text-slate-50">Day Cycle</p>
            <p className="text-xs font-normal leading-tight text-slate-400">14:30</p>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-700 mx-4"></div>
        <div className="flex items-center gap-4 pr-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-500 text-2xl">payments</span>
            <p className="text-slate-50 tracking-light text-sm font-bold leading-tight">$1,250</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-2xl">water_drop</span>
            <p className="text-slate-50 tracking-light text-sm font-bold leading-tight">100L</p>
          </div>
        </div>
      </header>

      {/* Footer Actions */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <div className="flex justify-center items-center gap-2 p-2 rounded-full bg-background-dark/80 backdrop-blur-sm shadow-lg border border-slate-800/50">
          <button className="flex flex-col items-center p-3 rounded-full text-slate-200 hover:bg-primary/20 transition-colors w-20">
            <span className="material-symbols-outlined text-2xl">bug_report</span>
            <span className="text-xs mt-1">Protect</span>
          </button>
          <button className="flex flex-col items-center p-3 rounded-full text-slate-200 hover:bg-primary/20 transition-colors w-20">
            <span className="material-symbols-outlined text-2xl">water_drop</span>
            <span className="text-xs mt-1">Water</span>
          </button>
          <button className="flex flex-col items-center p-3 rounded-full bg-primary/30 text-primary ring-2 ring-primary w-20">
            <span className="material-symbols-outlined text-2xl">content_cut</span>
            <span className="text-xs mt-1">Prune</span>
          </button>
          <button className="flex flex-col items-center p-3 rounded-full text-slate-200 hover:bg-primary/20 transition-colors w-20">
            <span className="material-symbols-outlined text-2xl">agriculture</span>
            <span className="text-xs mt-1">Harvest</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HUD;
