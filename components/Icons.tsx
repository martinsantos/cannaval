import React from 'react';

export const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export const CannavalLogoIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.32 7.55A6.03 6.03 0 0 1 12 2a6.03 6.03 0 0 1-5.32 5.55A8.02 8.02 0 0 0 2 15.25c0 4.42 3.58 8 8 8h4c4.42 0 8-3.58 8-8a8.02 8.02 0 0 0-4.68-7.7zM12 11.75a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1 0-1.5h1zm2.5 1.5a.75.75 0 0 1 1.5 0v1a.75.75 0 0 1-1.5 0v-1zM9.5 13.25a.75.75 0 0 0 0 1.5h-1a.75.75 0 0 0 0-1.5h1zM12 16.25a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 0 1.5h-4z"/>
    </svg>
);

export const LeafIcon = ({ className = "h-5 w-5 mr-2" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.41 6.5l-1.12 1.94c-1.16-1-2.6-1.57-4.29-1.57s-3.13.57-4.29 1.57L4.59 8.5l1.73 1-1.38 2.39c.8.46 1.74.71 2.76.71.69 0 1.34-.14 1.94-.38v2.28h-1.5v2h1.5v2h2v-2h1.5v-2h-1.5v-2.28c.6.24 1.25.38 1.94.38 1.02 0 1.96-.25 2.76-.71L17.68 9.5l1.73-1-1.59-1.94z" />
    </svg>
);

export const QrCodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h-1m-1 0H9m11-7h-1M6 12H5m1 0h1m0 0h1m6-6v1m0 1V9m0 1v1m0 0v1m-6 6h1m0 0h1m-1-1v-1m0 0V9m0 0h1m0 0h1m-7 8v-1m0 0v-1m0 0V9m0 0H9m0 0H8m-2 8v-1m0 0v-1m0 0V9m0 0H5m0 0H4m16 0h-1m-1 0h-1m0 0H9m8 8h1m0 0h1m-1-1v1m0-1v-1m0-1v-1m-7 4h1m0 0h1m0 0h1" />
    </svg>
);

export const QrScannerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5 5" />
    </svg>
);

export const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const SparklesIcon = ({ className = "h-5 w-5 mr-2" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M19 3v4M17 5h4M14 10l-2 2-2-2M14 14l-2 2-2-2m5-4h4m-4 4h4" />
    </svg>
);

export const PencilIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

export const TrashIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const IdentificationIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4m-2 11V9m0 0L9 12m2-3l2 3" />
    </svg>
);

export const DocumentTextIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const BrainIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 00-1.635-1.635L12.75 18l1.188-.648a2.25 2.25 0 001.635-1.635L16.25 14.25l.648 1.188a2.25 2.25 0 001.635 1.635L19.75 18l-1.188.648a2.25 2.25 0 00-1.635 1.635z" />
    </svg>
);

export const CalendarDaysIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const BellIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

export const NutrientIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21V3m0 18H8.944a2.25 2.25 0 01-2.185-1.666L5.25 12.636m8.25 8.364H15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0015 4.5h-3.75a2.25 2.25 0 00-2.25 2.25v1.5M13.5 21v-9.364m0 0H5.25" />
  </svg>
);

export const BookOpenIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

export const WaterDropIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s9.75 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0112 5.25zm-2.25 6a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm3.938 3.25a.75.75 0 01-.563.938l-2.5 1a.75.75 0 11-.75-1.875l2.5-1a.75.75 0 011.313.937z" clipRule="evenodd" />
    </svg>
);

export const ScissorsIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
);

export const CalendarIcon = ({ className = "h-5 w-5 mr-2" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const ClockIcon = ({ className = "h-5 w-5 mr-2" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const GridLayoutIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 11a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

export const FlowerIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53,21.41A3.49,3.49,0,0,0,15,19a3.49,3.49,0,0,0-1.53-2.91,1.49,1.49,0,0,0-2,0A3.49,3.49,0,0,0,9,19a3.49,3.49,0,0,0,2.47,3.41,1.5,1.5,0,0,0,1.06,0Z"/>
    <path d="M17.47,16.59a3.49,3.49,0,0,0,0-5.18,1.49,1.49,0,0,0-2,0,3.49,3.49,0,0,0-4.94,0,1.49,1.49,0,0,0-2,0,3.49,3.49,0,0,0,0,5.18,1.49,1.49,0,0,0,2,0,3.49,3.49,0,0,0,4.94,0,1.49,1.49,0,0,0,2,0Z"/>
    <path d="M12,12a4,4,0,1,0-4-4A4,4,0,0,0,12,12Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,12,6Z"/>
    <path d="M18,12a4,4,0,1,0-4-4A4,4,0,0,0,18,12Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,18,6Z"/>
    <path d="M6,12a4,4,0,1,0-4-4A4,4,0,0,0,6,12ZM6,6A2,2,0,1,1,4,8,2,2,0,0,1,6,6Z"/>
  </svg>
);

export const ViewListIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 4.75A.75.75 0 013.75 4h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 4.75zM3 10a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10zm0 5.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

export const ChevronDownIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
export const XIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>

// Stage Icons
export const SeedlingIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none">
        <path d="M15 21H9C8.44772 21 8 20.5523 8 20V19C8 18.4477 8.44772 18 9 18H15C15.5523 18 16 18.4477 16 19V20C16 20.5523 15.5523 21 15 21Z" fill="#78716c"/>
        <path d="M17 18H7C6.44772 18 6 17.5523 6 17V16C6 15.4477 6.44772 15 7 15H17C17.5523 15 18 15.4477 18 16V17C18 17.5523 17.5523 18 17 18Z" fill="#a16207"/>
        <path d="M12 15V11" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 12C8.5 11 9 10 12 10C15 10 15.5 11 16 12" stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10C12 8.5 11.5 7.5 10.5 6.5L12 8L13.5 6.5C12.5 7.5 12 8.5 12 10Z" fill="#84cc16"/>
        <path d="M12 10C12 8.5 11.5 7.5 10.5 6.5L12 8L13.5 6.5" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
export const VegetativeIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 22V12" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 17C9.33333 17.3333 8 19 7 21" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 17C14.6667 17.3333 16 19 17 21" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 9C10 5.66667 8.5 3.5 7 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 2L10 6L10.5 3L12 7L13.5 3L14 6L17 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 9C14 5.66667 15.5 3.5 17 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 14C9 11.6667 7.5 10 6 9" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 9L9 11.5L9.5 9.5L12 12L14.5 9.5L15 11.5L18 9" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 14C15 11.6667 16.5 10 18 9" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 19C10.5 17.6667 9.5 16.5 8 16" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 16L10.5 17.5L11 16L12 17L13 16L13.5 17.5L16 16" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.5 19C13.5 17.6667 14.5 16.5 16 16" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
export const EarlyFloweringIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 22V12" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 9C10 5.66667 8.5 3.5 7 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 2L10 6L10.5 3L12 7L13.5 3L14 6L17 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 9C14 5.66667 15.5 3.5 17 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 14C9 11.6667 7.5 10 6 9" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 9L9 11.5L9.5 9.5L12 12L14.5 9.5L15 11.5L18 9" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 14C15 11.6667 16.5 10 18 9" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17C9.33333 17.3333 8 19 7 21" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 17C14.6667 17.3333 16 19 17 21" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="1" fill="#ec4899"/>
        <circle cx="9.5" cy="9.5" r="1" fill="#ec4899"/>
        <circle cx="14.5" cy="9.5" r="1" fill="#ec4899"/>
        <circle cx="12" cy="12" r="1" fill="#ec4899"/>
        <path d="M11.5 6.5C11 6 10.5 6.5 11 7" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        <path d="M12.5 6.5C13 6 13.5 6.5 13 7" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        <path d="M9 9C8.5 8.5 8.5 9.5 9 10" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        <path d="M10 9C10.5 8.5 10.5 9.5 10 10" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        <path d="M14 9C13.5 8.5 13.5 9.5 14 10" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        <path d="M15 9C15.5 8.5 15.5 9.5 15 10" stroke="white" strokeWidth="1" strokeLinecap="round"/>
    </svg>
);
export const LateFloweringIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 22V13" stroke="#14532d" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 18C10.5 18.1667 10 19 9.5 20" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 18C13.5 18.1667 14 19 14.5 20" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 13C10.5 13.1667 9.5 14 9 15" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 13C13.5 13.1667 14.5 14 15 15" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
            <radialGradient id="budGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#a78bfa', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor: '#5b21b6', stopOpacity:1}} />
            </radialGradient>
        </defs>
        <circle cx="12" cy="7" r="4" fill="url(#budGradient)"/>
        <circle cx="9" cy="11" r="3.5" fill="url(#budGradient)"/>
        <circle cx="15" cy="11" r="3.5" fill="url(#budGradient)"/>
        <circle cx="12" cy="13" r="3" fill="url(#budGradient)"/>
        <path d="M11 6.5C10 6 9.5 7.5 10.5 8" stroke="#f97316" strokeWidth="0.75" strokeLinecap="round"/>
        <path d="M13 6.5C14 6 14.5 7.5 13.5 8" stroke="#f97316" strokeWidth="0.75" strokeLinecap="round"/>
        <path d="M8 10.5C7 10 6.5 11.5 7.5 12" stroke="#f97316" strokeWidth="0.75" strokeLinecap="round"/>
        <path d="M10 10.5C11 10 11.5 11.5 10.5 12" stroke="#f97316" strokeWidth="0.75" strokeLinecap="round"/>
        <path d="M14 10.5C13 10 12.5 11.5 13.5 12" stroke="#f97316" strokeWidth="0.75" strokeLinecap="round"/>
        <path d="M16 10.5C17 10 17.5 11.5 16.5 12" stroke="#f97316" strokeWidth="0.75" strokeLinecap="round"/>
    </svg>
);
export const HarvestIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.66 2.31a3.5 3.5 0 0 0-3.32 0 3.5 3.5 0 0 0-1.97 3.14 3.5 3.5 0 0 0 2.3 3.34l-1.33 2.66a.5.5 0 0 0 .66.66l2.66-1.33a3.5 3.5 0 0 0 3.34-2.3 3.5 3.5 0 0 0-1.97-4.51z" fill="#f59e0b"/>
        <path d="M10 6.5l.5-1-.5-.5-1 .5.5 1 .5.5z" fill="#fbbf24"/>
        <path d="M13.5 3.5l-1 .5.5.5.5-1-.5-.5z" fill="#fbbf24"/>
        <path d="M8.5 4.5l.5-1-1 .5.5.5z" fill="#fbbf24"/>
        <path d="M9 8l-1 .5.5.5.5-1z" fill="#fbbf24"/>
        <path d="M12.5 6l.5.5-1 .5-.5-1 .5-.5z" fill="#fbbf24"/>
        <path d="M11 2.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5z" fill="#d97706"/>
        <path d="M11.66 2.31a3.5 3.5 0 0 0-3.32 0 3.5 3.5 0 0 0-1.97 3.14 3.5 3.5 0 0 0 2.3 3.34l-1.33 2.66a.5.5 0 0 0 .66.66l2.66-1.33a3.5 3.5 0 0 0 3.34-2.3 3.5 3.5 0 0 0-1.97-4.51z" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17" cy="18" r="4" stroke="#94a3b8" strokeWidth="1.5"/>
        <circle cx="17" cy="18" r="1.5" fill="#94a3b8"/>
        <circle cx="9" cy="18" r="4" stroke="#94a3b8" strokeWidth="1.5"/>
        <circle cx="9" cy="18" r="1.5" fill="#94a3b8"/>
        <path d="M15.5 16.5L10 11.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13 14L18 9" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
export const CheckIcon = ({ className = "h-5 w-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>

export const HandIcon = ({ className = "h-5 w-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0 0V6.5m0 4.5a1.5 1.5 0 113 0m-3 0a1.5 1.5 0 10-3 0" /></svg>;

export const SunIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.657-8.657l-.707.707M4.343 4.343l-.707.707m16.314 0l-.707-.707M4.343 19.657l-.707-.707M12 12a5 5 0 11-10 0 5 5 0 0110 0z" />
    </svg>
);

export const LocationMarkerIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const MapPinIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.27.615-.454L16 14.55a.75.75 0 00-1.06-1.06l-5.195 5.196a.75.75 0 001.06 1.06l5.195-5.195a.75.75 0 00-1.06-1.06l-5.195 5.195a.75.75 0 001.06 1.06l5.195-5.195a.75.75 0 00-1.06-1.06L10 17.172l-5.195-5.195a.75.75 0 00-1.06 1.06l5.195 5.195z" clipRule="evenodd" />
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" />
    </svg>
);

export const SatelliteIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M7 3.5A1.5 1.5 0 018.5 2h3A1.5 1.5 0 0113 3.5v1.259a1.5 1.5 0 01.343 1.012l.248 1.486a1.5 1.5 0 01-.05 1.033l-.52 1.215a.75.75 0 00.29.988l.586.44a.75.75 0 01.29.987l-.52 1.215a1.5 1.5 0 01-.05 1.033l-.248 1.486A1.5 1.5 0 0111.5 16.25H8.5A1.5 1.5 0 017 14.75v-1.259a1.5 1.5 0 01-.343-1.012l-.248-1.486a1.5 1.5 0 01.05-1.033l.52-1.215a.75.75 0 00-.29-.988l-.586-.44a.75.75 0 01-.29-.987l.52-1.215a1.5 1.5 0 01.05-1.033l.248-1.486A1.5 1.5 0 017 4.759V3.5zM8.5 4a.5.5 0 00-.5.5v1.259a.5.5 0 00.114.338l.248 1.486a.5.5 0 00.017.344l-.52 1.215a1.75 1.75 0 00-.676 2.304l.586.44a1.75 1.75 0 00.676 2.304l.52 1.215a.5.5 0 00-.017.344l-.248 1.486a.5.5 0 00-.114.338V14.5a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-1.259a.5.5 0 00-.114-.338l-.248-1.486a.5.5 0 00.017-.344l.52-1.215a1.75 1.75 0 00.676-2.304l-.586-.44a1.75 1.75 0 00-.676-2.304l-.52-1.215a.5.5 0 00.017-.344l.248-1.486A.5.5 0 0011.5 5.259V4.5a.5.5 0 00-.5-.5h-2.5z" />
    </svg>
);


export const ZoomInIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>
);

export const ZoomOutIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
    </svg>
);

export const ExpandIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11 5v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11-5V4m0 0h-4m4 0l-5 5" />
    </svg>
);

export const SquaresPlusIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

export const RotateClockwiseIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
    </svg>
);

export const RotateCounterClockwiseIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);