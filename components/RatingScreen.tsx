import React, { useEffect } from 'react';

interface RatingScreenProps {
    onComplete: () => void;
}

const RatingScreen: React.FC<RatingScreenProps> = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="w-full h-screen bg-black text-gray-300 flex items-center justify-center font-sans">
            <div className="w-full max-w-2xl border-4 border-gray-300 p-8 flex gap-8">
                <div className="w-1/4 flex flex-col items-center justify-center border-2 border-gray-300 p-4">
                    <span className="text-6xl font-extrabold">RP</span>
                    <span className="text-sm font-bold tracking-widest">RATING PENDING</span>
                </div>
                <div className="w-3/4">
                    <p className="mb-4">
                        Puede contener contenido no apropiado para niños.
                        Visita <span className="underline">cannasim.com</span> para información de calificación.
                    </p>
                    <hr className="border-gray-300 my-4" />
                    <p className="text-sm">
                        CANNASIM RATINGS BOARD
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RatingScreen;