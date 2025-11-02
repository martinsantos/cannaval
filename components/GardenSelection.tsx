import React from 'react';

interface GardenSelectionProps {
  onGardenSelect: (type: 'Interior' | 'Exterior') => void;
}

const GardenSelection: React.FC<GardenSelectionProps> = ({ onGardenSelect }) => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex flex-1 justify-center py-10 sm:py-20 px-4 sm:px-6 md:px-8">
            <div className="layout-content-container flex flex-col max-w-4xl w-full flex-1 gap-8">
              <div className="flex flex-col gap-3 text-center">
                <h1 className="text-text-light dark:text-text-dark text-4xl sm:text-5xl font-black tracking-tighter">
                  Selecciona tu tipo de jardín
                </h1>
                <p className="text-text-muted-light dark:text-text-muted-dark text-lg">
                  Elige dónde quieres empezar a cultivar tus plantas.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 @container">
                {/* Card Interior */}
                <div className="flex flex-col items-stretch justify-start rounded-lg bg-surface-light dark:bg-surface-dark shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                    style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAAg18M2Al3C8b378cYPhttj6M8PfPt7SxXOVBAbBEUDBp4bYZppOqTceasY9py8uBmq1xwUbBFNNANcJxfNghzUw3wwqQaZNRR7y52is49dz5stuozee-to49aozT9oxkTRkF6fVemB0BZDydfGPtgbVlJ4V7Q9jmsVNeHviylnQn4FtKxTiRDMsn75zwcggQDxf4eVubJwqB4RFqCNNc-Nbro9Ow0yYsjd98nSs7XnZ1ctvGAMLJEJEmP_S_A0KIWatxaJqwnoUc")` }}
                  ></div>
                  <div className="flex flex-1 flex-col items-stretch justify-between gap-4 p-6">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-text-light dark:text-text-dark text-2xl font-bold tracking-tight">Interior</h2>
                      <p className="text-text-muted-light dark:text-text-muted-dark text-base">
                        Control total sobre el ambiente, discreción y cosechas todo el año.
                      </p>
                    </div>
                    <button
                      onClick={() => onGardenSelect('Interior')}
                      className="flex w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-6 bg-[#fb923c] text-text-light text-base font-bold transition-colors hover:bg-orange-500"
                    >
                      <span className="material-symbols-outlined">lightbulb</span>
                      <span className="truncate">Elegir Interior</span>
                    </button>
                  </div>
                </div>
                {/* Card Exterior */}
                <div className="flex flex-col items-stretch justify-start rounded-lg bg-surface-light dark:bg-surface-dark shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                    style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmIozRVVXXhE90dU8Glf8oKrdwsH9FgGi20-Szg9L6OMvCgADjlfyvvkIbZoLFS_1aWBVEmPZVUh8SSDlTw30VVtXIpwvVbwLKFUD4-IvCy-48-xv6KCjgWRK5tdjueTCUvuCahEgwwblhz9XD27VTtA2OqSldZYzOvMzbwY8KpZBYMgDX3Wh0p2xmK2_wO2fRqO9yhmVRWWtig2COWrjoT13Pz0CpiggtVhY9I_4wb3DyHWr350RdJgi4yv9pvWQ1GC7vINq9imI")` }}
                  ></div>
                  <div className="flex flex-1 flex-col items-stretch justify-between gap-4 p-6">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-text-light dark:text-text-dark text-2xl font-bold tracking-tight">Exterior</h2>
                      <p className="text-text-muted-light dark:text-text-muted-dark text-base">
                        Menor coste inicial, mayor rendimiento potencial y dependencia del clima.
                      </p>
                    </div>
                    <button
                      onClick={() => onGardenSelect('Exterior')}
                      className="flex w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-6 bg-[#fb923c] text-text-light text-base font-bold transition-colors hover:bg-orange-500"
                    >
                      <span className="material-symbols-outlined">sunny</span>
                      <span className="truncate">Elegir Exterior</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GardenSelection;
