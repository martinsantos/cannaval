import React from 'react';
import { Alert } from '../game/types';
import { WaterIcon, FertilizeIcon, PestIcon, TemperatureIcon, WarningIcon, PruneIcon } from './Icons';

interface AlertsPanelProps {
    alerts: Alert[];
    onAlertClick: (plantId: number) => void;
    gameDay: number;
}

const AlertIcon: React.FC<{ type: Alert['type'] }> = ({ type }) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
        case 'water': return <WaterIcon {...iconProps} />;
        case 'nutrients': return <FertilizeIcon {...iconProps} />;
        case 'pest': return <PestIcon {...iconProps} />;
        case 'heat_stress':
        case 'cold_stress': return <TemperatureIcon {...iconProps} />;
        case 'prune': return <PruneIcon {...iconProps} />;
        default: return <WarningIcon {...iconProps} />;
    }
};

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAlertClick, gameDay }) => {
    if (alerts.length === 0) {
        return null;
    }

    const severityClasses = {
        low: 'border-yellow-400',
        medium: 'border-orange-500',
        high: 'border-red-600 stress-pulse',
    };

    return (
        <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-auto z-20 w-64">
            <div className="bg-gradient-to-b from-[#7c553a] to-[#6b4628] border-2 border-amber-900/60 rounded-lg p-2 shadow-2xl max-h-[60vh] overflow-y-auto">
                <h3 className="text-center font-header text-yellow-200 tracking-wider mb-2">ALERTAS</h3>
                <div className="space-y-2">
                    {alerts.map(alert => {
                        const daysLeft = Math.max(0, alert.deadlineDay - gameDay);
                        const countdownText = daysLeft > 1 ? `${daysLeft} días restantes` : daysLeft === 1 ? `1 día restante` : `¡Último día!`;
                        const countdownColor = daysLeft <= 1 ? 'text-red-400' : 'text-yellow-200/80';
                        
                        return (
                            <div
                                key={alert.id}
                                onClick={() => onAlertClick(alert.plantId)}
                                className={`bg-black/50 p-2 rounded-md border-l-4 ${severityClasses[alert.severity]} cursor-pointer hover:bg-black/70 transition-colors`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0">
                                        <AlertIcon type={alert.type} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{alert.strainName}</p>
                                        <p className="text-xs text-yellow-100/80">{alert.message}</p>
                                        <p className={`text-xs font-semibold mt-1 ${countdownColor}`}>{countdownText}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default AlertsPanel;