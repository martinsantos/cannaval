import React from 'react';

const GameEntry: React.FC<{ onNewGame: () => void }> = ({ onNewGame }) => {
  return (
    <div className="relative flex h-screen w-full flex-col group/design-root">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(16, 34, 22, 0.7) 0%, rgba(16, 34, 22, 0.1) 50%, rgba(16, 34, 22, 0.7) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCeAqmuC22xIbLEW0SbKAcHPHrv7sC7g8NHt6YD4qdYmq7hX1UvO3a2gWsC6jZkn8Pld8-udPHvYHvADkY6s-4LMlpHVEt1-0v-4q2mmd37pVUG67X5cBAKQsHeJZFYNKCw71gKVM2wPTkhwXAsg9-4IgG4e4KFodVfQWQJgRUl1dpHZujcTQAUIGFep-wTnUJU360h6VlVN8YF1QxTUPLxV6q4ay8fk_gLZq_dQGwao_VQ4p5NIpNFRm0Zli7Vr-ZMdzm6TKcj4to')`
          }}
        ></div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex h-full grow flex-col text-white">
        <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
          {/* Top Toolbar: Social Icons - Placeholder */}
          <div className="flex justify-end gap-2">
            <button className="p-2 text-white/80 hover:text-white transition-colors duration-200">
              <span className="material-symbols-outlined">question_mark</span>
            </button>
            <button className="p-2 text-white/80 hover:text-white transition-colors duration-200">
              <span className="material-symbols-outlined">campaign</span>
            </button>
          </div>
          {/* Center Content: Title and Buttons */}
          <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
            {/* Hero Section: Title and Subtitle */}
            <div className="flex flex-col gap-2">
              <h1
                className="text-white text-6xl sm:text-7xl lg:text-8xl font-black leading-tight tracking-tighter"
                style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
              >
                Green Empire
              </h1>
              <h2 className="text-white/90 text-base sm:text-lg font-normal leading-normal">
                Your very own medicinal cannabis cultivation journey awaits.
              </h2>
            </div>
            {/* Button Group */}
            <div className="flex w-full max-w-sm flex-col items-stretch gap-4 px-4 py-3">
              <button
                onClick={onNewGame}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-[#0df259] text-[#102216] text-lg font-bold leading-normal tracking-[0.015em] transition-transform duration-200 hover:scale-105 shadow-lg shadow-primary/30"
              >
                <span className="truncate">Nueva Partida</span>
              </button>
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-white/20 backdrop-blur-sm text-white text-lg font-bold leading-normal tracking-[0.015em] transition-transform duration-200 hover:scale-105 hover:bg-white/30 opacity-50 cursor-not-allowed">
                <span className="truncate">Cargar Partida</span>
              </button>
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-transparent text-white/80 text-lg font-bold leading-normal tracking-[0.015em] transition-transform duration-200 hover:scale-105 hover:text-white hover:bg-white/10 opacity-50 cursor-not-allowed">
                <span className="truncate">Opciones</span>
              </button>
            </div>
          </div>
          {/* Bottom Meta Text: Version */}
          <div className="flex justify-end">
            <p className="text-white/60 text-sm font-normal leading-normal">v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEntry;
