import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Plant, Log, LogType, StageName, CustomReminder } from '../types';
import Modal from './Modal';
import { QRCodeCanvas } from 'qrcode.react';
import ImageEditorModal from './ImageEditorModal';
import PlantCalendar from './PlantCalendar';
import StageTimeline from './StageTimeline';
import { StageIndicator } from '../utils/stageUtils';
import { QrCodeIcon, PencilIcon, TrashIcon, CameraIcon, SparklesIcon, IdentificationIcon, DocumentTextIcon, CalendarDaysIcon, BellIcon, NutrientIcon, BookOpenIcon, WaterDropIcon, ScissorsIcon, LeafIcon, QuestionMarkCircleIcon, DuplicateIcon } from './Icons';
import Tooltip from './Tooltip';

interface PlantDetailModalProps {
  plant: Plant | null;
  onClose: () => void;
  onUpdatePlant: (updatedPlant: Plant) => void;
  onClonePlant: () => void;
  isExampleMode: boolean;
}

const LogIcons: { [key in LogType]: string } = {
    'Riego': '💧',
    'Fertilización': '💊',
    'Observación': '👀',
    'Poda': '✂️',
};

const PREDEFINED_STAGES: StageName[] = [
    'Plántula',
    'Vegetativo',
    'Floración Temprana',
    'Floración Tardía',
    'Lista para Cosecha'
];

const TabButton: React.FC<{active: boolean, onClick: () => void, children: React.ReactNode, icon: React.ReactNode}> = ({ active, onClick, children, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 text-sm sm:text-base px-3 py-3 font-semibold border-b-2 transition -mb-px ${
            active 
            ? 'border-primary text-primary' 
            : 'border-transparent text-medium hover:text-light'
        }`}
    >
       {icon} {children}
    </button>
);

const LogIconComponent: React.FC<{ type: LogType }> = ({ type }) => {
    const className = "h-5 w-5 text-primary";
    switch(type) {
        case 'Riego': return <WaterDropIcon className={className} />;
        case 'Fertilización': return <NutrientIcon className={className} />;
        case 'Poda': return <ScissorsIcon className={className} />;
        case 'Observación':
        default:
             return <LeafIcon className={className} />;
    }
};

const GrowthChart: React.FC<{ logs: Log[] }> = ({ logs }) => {
    const [hoverInfo, setHoverInfo] = useState<{
        x: number;
        y: number;
        date: Date;
        height?: number;
        width?: number;
    } | null>(null);

    const data = useMemo(() => {
        return logs
            .filter(log => log.height !== undefined || log.width !== undefined)
            .map(log => ({
                date: new Date(log.date),
                height: log.height,
                width: log.width,
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [logs]);

    if (data.length < 2) {
        return (
            <div className="bg-surface p-4 rounded-lg mt-4 border border-subtle text-center text-medium">
                <h3 className="text-xl font-semibold mb-2 text-light">Gráfico de Crecimiento</h3>
                <p>No hay suficientes datos para mostrar un gráfico. Guarda las medidas de altura y anchura de la planta en la pestaña 'Resumen' para empezar a visualizar su crecimiento.</p>
            </div>
        );
    }
    
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const minDate = data[0].date;
    const maxDate = data[data.length - 1].date;
    
    const allValues = data.flatMap(d => [d.height, d.width]).filter(v => v !== undefined) as number[];
    const maxValue = Math.max(...allValues, 0);

    const xScale = (date: Date) => {
        const timeRange = maxDate.getTime() - minDate.getTime();
        if (timeRange === 0) return margin.left;
        return margin.left + ((date.getTime() - minDate.getTime()) / timeRange) * innerWidth;
    };

    const yScale = (value: number) => {
        if (maxValue === 0) return margin.top + innerHeight;
        return margin.top + innerHeight - (value / maxValue) * innerHeight;
    };
    
    const heightPath = data
        .filter(d => d.height !== undefined)
        .map(d => `${xScale(d.date)},${yScale(d.height!)}`)
        .join(' ');
        
    const widthPath = data
        .filter(d => d.width !== undefined)
        .map(d => `${xScale(d.date)},${yScale(d.width!)}`)
        .join(' ');

    const yAxisTicks = Array.from({ length: 5 }, (_, i) => Math.round((maxValue / 4) * i));
    const xAxisTicks = (() => {
        const ticks = [];
        const timeRange = maxDate.getTime() - minDate.getTime();
        if (timeRange === 0) return [minDate];

        const tickCount = Math.min(data.length, 5);
        if (tickCount <= 1) return [minDate];

        for (let i = 0; i < tickCount; i++) {
            const date = new Date(minDate.getTime() + (timeRange / (tickCount - 1)) * i);
            ticks.push(date);
        }
        return ticks;
    })();

    return (
      <div className="bg-surface p-4 rounded-lg mt-4 border border-subtle">
        <h3 className="text-xl font-semibold mb-4 text-light text-center">Gráfico de Crecimiento (Altura vs. Anchura)</h3>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {yAxisTicks.map(tick => (
                <line key={`grid-${tick}`} x1={margin.left} y1={yScale(tick)} x2={width - margin.right} y2={yScale(tick)} stroke="#e2e8f0" strokeWidth="0.5" />
            ))}
            
            <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + innerHeight} stroke="#64748b" />
            <line x1={margin.left} y1={margin.top + innerHeight} x2={width - margin.right} y2={margin.top + innerHeight} stroke="#64748b" />

            {yAxisTicks.map(tick => (
                <text key={`y-label-${tick}`} x={margin.left - 8} y={yScale(tick)} textAnchor="end" alignmentBaseline="middle" fill="#64748b" fontSize="10">
                    {tick} cm
                </text>
            ))}

            {xAxisTicks.map((tick, i) => (
                <text key={`x-label-${i}`} x={xScale(tick)} y={height - margin.bottom + 15} textAnchor="middle" fill="#64748b" fontSize="10">
                    {tick.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                </text>
            ))}

            {heightPath && <polyline points={heightPath} fill="none" stroke="#10b981" strokeWidth="2" />}
            {widthPath && <polyline points={widthPath} fill="none" stroke="#8b5cf6" strokeWidth="2" />}
            
            {data.map((d, i) => (
                <g key={i}>
                    {d.height !== undefined && (
                        <circle
                            cx={xScale(d.date)}
                            cy={yScale(d.height)}
                            r="4"
                            fill="#10b981"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoverInfo({ x: xScale(d.date), y: yScale(d.height!), date: d.date, height: d.height })}
                            onMouseLeave={() => setHoverInfo(null)}
                        />
                    )}
                    {d.width !== undefined && (
                        <circle
                            cx={xScale(d.date)}
                            cy={yScale(d.width)}
                            r="4"
                            fill="#8b5cf6"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoverInfo({ x: xScale(d.date), y: yScale(d.width!), date: d.date, width: d.width })}
                            onMouseLeave={() => setHoverInfo(null)}
                        />
                    )}
                </g>
            ))}

            {hoverInfo && (
                <g transform={`translate(${hoverInfo.x}, ${hoverInfo.y})`} className="pointer-events-none">
                    <g transform={`translate(${hoverInfo.x > width / 2 ? -120 : 10}, -10)`}>
                        <rect
                            x="0"
                            y="-25"
                            width="110"
                            height="40"
                            rx="4"
                            fill="rgba(15, 23, 42, 0.85)"
                            stroke="#e2e8f0"
                            strokeWidth="0.5"
                        />
                        <text fill="#f1f5f9" fontSize="10">
                            <tspan x="5" dy="-12" className="font-semibold">
                                {hoverInfo.date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                            </tspan>
                            {hoverInfo.height !== undefined && (
                                <tspan x="5" dy="12">
                                    Altura: <tspan className="font-bold">{hoverInfo.height} cm</tspan>
                                </tspan>
                            )}
                            {hoverInfo.width !== undefined && (
                                <tspan x="5" dy="12">
                                    Anchura: <tspan className="font-bold">{hoverInfo.width} cm</tspan>
                                </tspan>
                            )}
                        </text>
                    </g>
                </g>
            )}
        </svg>
        <div className="flex justify-center items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-primary"></div>
                <span className="text-light">Altura</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-accent"></div>
                <span className="text-light">Anchura</span>
            </div>
        </div>
      </div>
    );
};


const PlantHistory: React.FC<{ logs: Log[], onUpdatePlant: (plant: Plant) => void, plant: Plant, isExampleMode: boolean }> = ({ logs, onUpdatePlant, plant, isExampleMode }) => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterType, setFilterType] = useState<LogType | 'All'>('All');
    const [editingLogId, setEditingLogId] = useState<string | null>(null);
    const [editedLogData, setEditedLogData] = useState<{ type: LogType; notes: string; amount?: string; fertilizerType?: string }>({ type: 'Observación', notes: '', amount: '', fertilizerType: '' });

    const sortedLogs = useMemo(() => {
        const filtered = filterType === 'All'
            ? logs
            : logs.filter(log => log.type === filterType);
        
        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }, [logs, sortOrder, filterType]);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    const formatLogDate = (dateString: string) => {
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString('es-ES', { month: 'short', day: '2-digit', year: 'numeric' });
        const timePart = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
        return `${datePart} - ${timePart}`;
    };

    const handleDeleteLog = (logId: string) => {
        if (isExampleMode) return;
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
            const updatedLogs = plant.logs.filter(log => log.id !== logId);
            onUpdatePlant({ ...plant, logs: updatedLogs });
        }
    };
    
    const handleStartEdit = (log: Log) => {
        if (isExampleMode) return;
        setEditingLogId(log.id);
        setEditedLogData({ 
            type: log.type, 
            notes: log.notes,
            amount: log.amount?.toString() || '',
            fertilizerType: log.fertilizerType || '',
        });
    };

    const handleCancelEdit = () => {
        setEditingLogId(null);
    };

    const handleSaveEdit = () => {
        if (!editingLogId) return;
        const updatedLogs = plant.logs.map(log => {
            if (log.id === editingLogId) {
                const updatedLog: Log = {
                    ...log,
                    type: editedLogData.type,
                    notes: editedLogData.notes,
                };
                
                if (editedLogData.type === 'Riego' || editedLogData.type === 'Fertilización') {
                    updatedLog.amount = editedLogData.amount ? parseFloat(editedLogData.amount) : undefined;
                } else {
                    delete updatedLog.amount;
                }

                if (editedLogData.type === 'Fertilización') {
                    updatedLog.fertilizerType = editedLogData.fertilizerType || undefined;
                } else {
                    delete updatedLog.fertilizerType;
                }
                return updatedLog;
            }
            return log;
        });
        onUpdatePlant({ ...plant, logs: updatedLogs });
        setEditingLogId(null);
    };
    
    const FilterButton: React.FC<{ type: LogType | 'All', icon: React.ReactNode, text: string }> = ({ type, icon, text }) => (
        <button
            onClick={() => setFilterType(type)}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition ${filterType === type ? 'bg-primary text-white' : 'bg-subtle text-medium hover:bg-slate-300'}`}
        >
            {icon}
            {text}
        </button>
    );
    
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <FilterButton type="All" icon={<BookOpenIcon className="h-4 w-4" />} text="Todos" />
                    <FilterButton type="Riego" icon={<WaterDropIcon className="h-4 w-4" />} text="Riego" />
                    <FilterButton type="Fertilización" icon={<NutrientIcon className="h-4 w-4" />} text="Fertilización" />
                    <FilterButton type="Poda" icon={<ScissorsIcon className="h-4 w-4" />} text="Poda" />
                    <FilterButton type="Observación" icon={<LeafIcon className="h-4 w-4" />} text="Observación" />
                </div>
                <button onClick={toggleSortOrder} className="text-sm text-medium hover:text-light transition">
                    Ordenar: {sortOrder === 'desc' ? 'Más Recientes' : 'Más Antiguos'}
                </button>
            </div>

            {sortedLogs.length === 0 ? (
                <div className="text-center py-10 text-medium bg-background rounded-lg border border-subtle">No hay registros para mostrar con el filtro actual.</div>
            ) : (
                <ul className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    {sortedLogs.map(log => (
                        <li key={log.id} className="bg-background p-4 rounded-lg border border-subtle">
                           {editingLogId === log.id ? (
                               <div className="space-y-3">
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-medium">Tipo</label>
                                            <select
                                                value={editedLogData.type}
                                                onChange={e => setEditedLogData(prev => ({ ...prev, type: e.target.value as LogType, amount: '', fertilizerType: '' }))}
                                                className="w-full bg-surface border-subtle rounded px-2 py-1 text-sm"
                                            >
                                                <option value="Observación">Observación</option>
                                                <option value="Riego">Riego</option>
                                                <option value="Fertilización">Fertilización</option>
                                                <option value="Poda">Poda</option>
                                            </select>
                                        </div>
                                       {(editedLogData.type === 'Riego' || editedLogData.type === 'Fertilización') && (
                                            <div>
                                                <label className="text-xs text-medium">Cantidad (ml)</label>
                                                <input
                                                    type="number"
                                                    value={editedLogData.amount}
                                                    onChange={e => setEditedLogData(prev => ({ ...prev, amount: e.target.value }))}
                                                    className="w-full bg-surface border-subtle rounded px-2 py-1 text-sm"
                                                />
                                            </div>
                                       )}
                                       {editedLogData.type === 'Fertilización' && (
                                            <div className="sm:col-span-2">
                                                <label className="text-xs text-medium">Tipo de Fertilizante</label>
                                                <input
                                                    type="text"
                                                    value={editedLogData.fertilizerType}
                                                    onChange={e => setEditedLogData(prev => ({ ...prev, fertilizerType: e.target.value }))}
                                                    className="w-full bg-surface border-subtle rounded px-2 py-1 text-sm"
                                                />
                                            </div>
                                       )}
                                   </div>
                                    <div>
                                       <label className="text-xs text-medium">Notas</label>
                                       <textarea
                                           value={editedLogData.notes}
                                           onChange={e => setEditedLogData(prev => ({ ...prev, notes: e.target.value }))}
                                           className="w-full bg-surface border-subtle rounded px-2 py-1 text-sm h-24"
                                       />
                                   </div>
                                   <div className="flex justify-end gap-2">
                                       <button onClick={handleCancelEdit} className="py-1 px-3 bg-subtle text-light text-sm rounded hover:bg-slate-300">Cancelar</button>
                                       <button onClick={handleSaveEdit} className="py-1 px-3 bg-primary text-white text-sm rounded hover:bg-primary/90">Guardar</button>
                                   </div>
                               </div>
                           ) : (
                               <div className="flex items-start gap-4">
                                   <div className="mt-1">
                                       <LogIconComponent type={log.type} />
                                   </div>
                                   <div className="flex-grow">
                                       <div className="flex justify-between items-baseline">
                                           <h4 className="font-semibold text-light">{log.type}</h4>
                                           <span className="text-xs text-medium">{formatLogDate(log.date)}</span>
                                       </div>
                                       <p className="text-sm text-light whitespace-pre-wrap mt-1">{log.notes}</p>
                                       {(log.type === 'Riego' || log.type === 'Fertilización') && log.amount && (
                                           <p className="text-xs text-medium mt-1">Cantidad: {log.amount}ml</p>
                                       )}
                                       {log.type === 'Fertilización' && log.fertilizerType && (
                                           <p className="text-xs text-medium mt-1">Fertilizante: {log.fertilizerType}</p>
                                       )}
                                   </div>
                                   <div className="flex-shrink-0 flex gap-2">
                                       <button onClick={() => handleStartEdit(log)} className="p-1 text-medium hover:text-light disabled:opacity-50 disabled:cursor-not-allowed"><PencilIcon className="h-4 w-4" /></button>
                                       <button onClick={() => handleDeleteLog(log.id)} className="p-1 text-medium hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"><TrashIcon className="h-4 w-4" /></button>
                                   </div>
                               </div>
                           )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const LogEntryForm: React.FC<{ plant: Plant; addLog: (plantId: string, log: Omit<Log, 'id'>) => void; isExampleMode: boolean; }> = ({ plant, addLog, isExampleMode }) => {
    const [logType, setLogType] = useState<LogType>('Observación');
    const [notes, setNotes] = useState('');
    const [amount, setAmount] = useState('');
    const [fertilizerType, setFertilizerType] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!notes || isExampleMode) return;
        const newLog: Omit<Log, 'id'> = {
            date: new Date().toISOString(),
            type: logType,
            notes,
            amount: (logType === 'Riego' || logType === 'Fertilización') && amount ? parseFloat(amount) : undefined,
            fertilizerType: logType === 'Fertilización' ? fertilizerType : undefined,
        };
        addLog(plant.id, newLog);
        setNotes('');
        setAmount('');
        setFertilizerType('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-surface p-4 rounded-lg border border-subtle">
            <h3 className="text-lg font-semibold mb-3 text-light">Añadir Nuevo Registro</h3>
            <fieldset disabled={isExampleMode} className="space-y-4 disabled:opacity-60">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="logType" className="block text-sm font-medium text-medium">Tipo</label>
                        <select id="logType" value={logType} onChange={(e) => setLogType(e.target.value as LogType)} className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary">
                            <option>Observación</option>
                            <option>Riego</option>
                            <option>Fertilización</option>
                            <option>Poda</option>
                        </select>
                    </div>
                    {(logType === 'Riego' || logType === 'Fertilización') && (
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-medium">Cantidad (ml)</label>
                            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                    )}
                    {logType === 'Fertilización' && (
                        <div>
                            <label htmlFor="fertilizerType" className="block text-sm font-medium text-medium">Tipo de Fertilizante</label>
                            <input type="text" id="fertilizerType" value={fertilizerType} onChange={(e) => setFertilizerType(e.target.value)} className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                    )}
                    <div className="md:col-span-3">
                        <label htmlFor="notes" className="block text-sm font-medium text-medium">Notas</label>
                        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-background border-subtle rounded-md shadow-sm py-2 px-3 text-light focus:outline-none focus:ring-primary focus:border-primary" required></textarea>
                    </div>
                </div>
                <button type="submit" disabled={isExampleMode} className="mt-4 w-full bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition disabled:bg-medium disabled:cursor-not-allowed">Guardar Registro</button>
            </fieldset>
        </form>
    );
};

const RemindersTab: React.FC<{ plant: Plant; onUpdatePlant: (updatedPlant: Plant) => void; isExampleMode: boolean; }> = ({ plant, onUpdatePlant, isExampleMode }) => {
    const [reminders, setReminders] = useState(plant.reminders || { enabled: true, wateringInterval: 3, fertilizingInterval: 7 });
    const [customReminders, setCustomReminders] = useState(plant.customReminders || []);
    const [newReminderTask, setNewReminderTask] = useState('');
    const [newReminderDate, setNewReminderDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        setReminders(plant.reminders || { enabled: true, wateringInterval: 3, fertilizingInterval: 7 });
        setCustomReminders(plant.customReminders || []);
    }, [plant]);

    const handleRemindersConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;
        setReminders(prev => ({ ...prev!, [name]: isCheckbox ? checked : parseInt(value) }));
    };
    
    const handleSaveReminders = () => {
        if (isExampleMode) return;
        onUpdatePlant({ ...plant, reminders, customReminders });
        alert("Configuración de recordatorios guardada.");
    };
    
    const handleAddCustomReminder = () => {
        if (!newReminderTask || !newReminderDate || isExampleMode) return;
        const newReminder: CustomReminder = {
            id: crypto.randomUUID(),
            task: newReminderTask,
            dueDate: new Date(newReminderDate).toISOString(),
        };
        setCustomReminders(prev => [...prev, newReminder]);
        setNewReminderTask('');
    };
    
    const handleDeleteCustomReminder = (id: string) => {
        if (isExampleMode) return;
        setCustomReminders(prev => prev.filter(r => r.id !== id));
    };

    return (
        <fieldset disabled={isExampleMode} className="space-y-6 disabled:opacity-60">
            <div className="bg-surface p-4 rounded-lg border border-subtle">
                <h3 className="text-lg font-semibold text-light mb-3">Recordatorios Automáticos</h3>
                <label className="flex items-center gap-3">
                    <input type="checkbox" name="enabled" checked={reminders.enabled} onChange={handleRemindersConfigChange} className="h-5 w-5 rounded bg-background border-subtle text-primary focus:ring-primary"/>
                    <span className="text-light">Habilitar recordatorios automáticos</span>
                </label>
                {reminders.enabled && (
                    <div className="mt-4 space-y-3 pl-8">
                         <div>
                            <label className="text-sm text-medium">Recordarme regar cada</label>
                            <div className="flex items-center gap-2">
                                <input type="number" name="wateringInterval" value={reminders.wateringInterval} onChange={handleRemindersConfigChange} className="w-20 bg-background border-subtle rounded px-2 py-1 text-sm"/>
                                <span>días</span>
                            </div>
                        </div>
                         <div>
                            <label className="text-sm text-medium">Recordarme fertilizar cada</label>
                            <div className="flex items-center gap-2">
                                <input type="number" name="fertilizingInterval" value={reminders.fertilizingInterval} onChange={handleRemindersConfigChange} className="w-20 bg-background border-subtle rounded px-2 py-1 text-sm"/>
                                <span>días</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-surface p-4 rounded-lg border border-subtle">
                <h3 className="text-lg font-semibold text-light mb-3">Recordatorios Personalizados</h3>
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {customReminders.map(r => (
                        <div key={r.id} className="bg-background p-2 rounded flex justify-between items-center">
                            <div>
                                <p className="text-light">{r.task}</p>
                                <p className="text-xs text-medium">Vence: {new Date(r.dueDate).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => handleDeleteCustomReminder(r.id)} className="p-1 text-medium hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>
                        </div>
                    ))}
                     {customReminders.length === 0 && <p className="text-sm text-medium text-center py-2">No hay recordatorios personalizados.</p>}
                </div>
                 <div className="flex items-end gap-2">
                    <div className="flex-grow">
                        <label className="text-xs text-medium">Tarea</label>
                        <input type="text" value={newReminderTask} onChange={e => setNewReminderTask(e.target.value)} placeholder="Ej: Rotar planta" className="w-full bg-background border-subtle rounded px-2 py-1.5 text-sm"/>
                    </div>
                    <div>
                        <label className="text-xs text-medium">Fecha</label>
                        <input type="date" value={newReminderDate} onChange={e => setNewReminderDate(e.target.value)} className="w-full bg-background border-subtle rounded px-2 py-1.5 text-sm"/>
                    </div>
                    <button onClick={handleAddCustomReminder} className="bg-primary text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-primary/90">Añadir</button>
                </div>
            </div>
            <button onClick={handleSaveReminders} disabled={isExampleMode} className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition disabled:bg-medium disabled:cursor-not-allowed">Guardar Configuración</button>
        </fieldset>
    );
};

const PlantDetailModal: React.FC<PlantDetailModalProps> = ({ plant, onClose, onUpdatePlant, onClonePlant, isExampleMode }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'logs' | 'qr' | 'calendar' | 'timeline' | 'reminders'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlant, setEditedPlant] = useState<Plant | null>(plant);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedPlant(plant);
    if(plant) {
        setActiveTab('info');
        setIsEditing(false); // Close editing mode when plant changes
    }
  }, [plant]);

  if (!plant) return null;

  const handleFieldChange = (field: keyof Plant, value: any) => {
    if (editedPlant) {
      setEditedPlant({ ...editedPlant, [field]: value });
    }
  };

  const handleSave = () => {
    if (editedPlant && !isExampleMode) {
      onUpdatePlant(editedPlant);
    }
    setIsEditing(false);
  };

  const handleDeletePlant = () => {
      if(isExampleMode) return;
      if(window.confirm(`¿Estás seguro de que quieres eliminar la planta "${plant.name}"? Esta acción no se puede deshacer.`)) {
         alert("Funcionalidad de eliminación pendiente de implementación en el estado principal.");
         onClose();
      }
  };

  const addLog = (plantId: string, log: Omit<Log, 'id'>) => {
    if (isExampleMode) return;
    const newLog = { ...log, id: crypto.randomUUID() };
    const updatedPlant = { ...plant, logs: [...plant.logs, newLog] };
    onUpdatePlant(updatedPlant);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isExampleMode) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageToEdit(event.target?.result as string);
        setIsImageEditorOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEditedPhoto = (base64Image: string) => {
    const base64Data = base64Image.split(',')[1];
    handleFieldChange('photo', base64Data);
    if(editedPlant && !isExampleMode) {
        onUpdatePlant({ ...editedPlant, photo: base64Data });
    }
    setIsImageEditorOpen(false);
    setImageToEdit(null);
  };
  
  const handleDownloadQR = useCallback(() => {
    if (qrCodeRef.current && plant) {
        const canvas = qrCodeRef.current.querySelector('canvas');
        if (canvas) {
            const pngUrl = canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');
            let downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `${plant.name.replace(/\s+/g, '_')}-QR.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
  }, [plant]);

  const plantedDate = new Date(plant.plantedDate);
  const age = Math.floor((new Date().getTime() - plantedDate.getTime()) / (1000 * 3600 * 24));
  
  const isCustomStage = editedPlant?.currentStage !== undefined && !PREDEFINED_STAGES.includes(editedPlant.currentStage as StageName);

  return (
    <Modal isOpen={!!plant} onClose={onClose} title="Detalles de la Planta" size="xl">
        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" disabled={isExampleMode} />
        {isImageEditorOpen && imageToEdit && (
            <ImageEditorModal 
                isOpen={isImageEditorOpen}
                onClose={() => setIsImageEditorOpen(false)}
                onSave={handleSaveEditedPhoto}
                imageSrc={imageToEdit}
            />
        )}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Panel */}
          <div className="md:w-1/3">
             <div className="relative mb-4 group">
                {plant.photo ? (
                    <img src={`data:image/jpeg;base64,${plant.photo}`} alt={plant.name} className="w-full h-64 object-cover rounded-lg shadow-lg" />
                ) : (
                    <div className="w-full h-64 bg-surface rounded-lg flex items-center justify-center border border-subtle">
                        <CameraIcon />
                    </div>
                )}
                {!isExampleMode && (
                    <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <PencilIcon /> <span className="ml-2">Cambiar Foto</span>
                    </button>
                )}
             </div>

            {isEditing ? (
              <div className="space-y-3">
                 <input type="text" value={editedPlant?.name || ''} onChange={e => handleFieldChange('name', e.target.value)} className="w-full text-2xl font-bold bg-background rounded p-2 border border-subtle" />
                 <input type="text" value={editedPlant?.strain || ''} onChange={e => handleFieldChange('strain', e.target.value)} className="w-full text-lg text-primary bg-background rounded p-2 border border-subtle" />
                 <div>
                    <label className="block text-sm font-medium text-medium">Etapa de Crecimiento</label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PREDEFINED_STAGES.map((stage) => (
                            <button
                                key={stage}
                                type="button"
                                onClick={() => handleFieldChange('currentStage', stage)}
                                className={`text-center p-2 text-sm font-semibold rounded-md transition ${
                                    editedPlant?.currentStage === stage
                                        ? 'bg-primary text-white ring-2 ring-offset-2 ring-offset-surface ring-primary'
                                        : 'bg-background hover:bg-subtle border border-subtle'
                                }`}
                            >
                                {stage}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleFieldChange('currentStage', '')}
                            className={`text-center p-2 text-sm font-semibold rounded-md transition ${
                                isCustomStage
                                    ? 'bg-primary text-white ring-2 ring-offset-2 ring-offset-surface ring-primary'
                                    : 'bg-background hover:bg-subtle border border-subtle'
                            }`}
                        >
                            Otra...
                        </button>
                    </div>
                    {isCustomStage && (
                        <input
                            type="text"
                            value={editedPlant?.currentStage || ''}
                            onChange={(e) => handleFieldChange('currentStage', e.target.value)}
                            placeholder="Nombre de etapa personalizada"
                            className="w-full bg-background rounded p-2 mt-3 animate-fade-in border border-subtle text-base"
                            autoFocus
                        />
                    )}
                </div>
                 <div>
                    <label className="text-sm text-medium">Altura (cm)</label>
                    <input type="number" value={editedPlant?.height || ''} onChange={e => handleFieldChange('height', parseFloat(e.target.value))} className="w-full bg-background rounded p-2 border border-subtle" />
                 </div>
                 <div>
                    <label className="text-sm text-medium">Anchura (cm)</label>
                    <input type="number" value={editedPlant?.width || ''} onChange={e => handleFieldChange('width', parseFloat(e.target.value))} className="w-full bg-background rounded p-2 border border-subtle" />
                 </div>
                 <textarea value={editedPlant?.notes || ''} onChange={e => handleFieldChange('notes', e.target.value)} className="w-full text-sm bg-background rounded p-2 h-24 border border-subtle" placeholder="Notas generales sobre la planta..."/>
                 <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-grow bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary/90">Guardar</button>
                    <button onClick={() => setIsEditing(false)} className="bg-subtle text-light py-2 px-4 rounded-md hover:bg-slate-300">Cancelar</button>
                 </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-3xl font-bold text-light">{plant.name}</h3>
                        <p className="text-lg text-primary font-semibold">{plant.strain}</p>
                    </div>
                    <div className="flex gap-1">
                        <Tooltip text="Clonar Planta">
                             <div>
                                <button onClick={onClonePlant} disabled={isExampleMode} className="p-2 text-medium hover:text-light disabled:opacity-50 disabled:cursor-not-allowed"><DuplicateIcon /></button>
                            </div>
                        </Tooltip>
                        <Tooltip text="Editar Planta">
                            <div>
                                <button onClick={() => setIsEditing(true)} disabled={isExampleMode} className="p-2 text-medium hover:text-light disabled:opacity-50 disabled:cursor-not-allowed"><PencilIcon /></button>
                            </div>
                        </Tooltip>
                        <Tooltip text="Eliminar Planta">
                            <div>
                                <button onClick={handleDeletePlant} disabled={isExampleMode} className="p-2 text-medium hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"><TrashIcon /></button>
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <StageIndicator stageName={plant.currentStage} />
                <p className="text-medium"><span className="font-semibold text-light">{age}</span> días desde la plantación</p>
                <div className="flex gap-4">
                  <p className="text-medium"><span className="font-semibold text-light">{plant.height || '--'}</span> cm Alto</p>
                  <p className="text-medium"><span className="font-semibold text-light">{plant.width || '--'}</span> cm Ancho</p>
                </div>
                <p className="text-sm text-light pt-2 border-t border-subtle">{plant.notes || 'Sin notas adicionales.'}</p>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="md:w-2/3">
             <div className="border-b border-subtle flex flex-wrap">
                <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<IdentificationIcon />}>Resumen</TabButton>
                <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<DocumentTextIcon />}>Registros</TabButton>
                <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={<SparklesIcon />}>L. Tiempo</TabButton>
                <TabButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<CalendarDaysIcon />}>Calendario</TabButton>
                <TabButton active={activeTab === 'reminders'} onClick={() => setActiveTab('reminders')} icon={<BellIcon />}>Recordatorios</TabButton>
                <TabButton active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} icon={<QrCodeIcon />}>QR</TabButton>
             </div>
             <div className="py-4">
                {activeTab === 'info' && (
                  <div>
                    <LogEntryForm plant={plant} addLog={addLog} isExampleMode={isExampleMode} />
                    <GrowthChart logs={plant.logs} />
                  </div>
                )}
                {activeTab === 'logs' && <PlantHistory logs={plant.logs} onUpdatePlant={onUpdatePlant} plant={plant} isExampleMode={isExampleMode} />}
                {activeTab === 'qr' && (
                    <div className="text-center bg-surface p-6 rounded-lg border border-subtle">
                        <h3 className="text-xl font-semibold mb-4 text-light">Código QR de la Planta</h3>
                        <div ref={qrCodeRef} className="bg-white p-4 inline-block rounded-md">
                           <QRCodeCanvas value={plant.id} size={256} />
                        </div>
                        <p className="text-medium mt-4">Usa el escáner para acceder rápidamente a esta planta.</p>
                        <button
                            onClick={handleDownloadQR}
                            className="mt-4 bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition"
                        >
                            Descargar QR
                        </button>
                    </div>
                )}
                {activeTab === 'calendar' && <PlantCalendar plant={plant} />}
                {activeTab === 'timeline' && <StageTimeline plant={plant} />}
                {activeTab === 'reminders' && <RemindersTab plant={plant} onUpdatePlant={onUpdatePlant} isExampleMode={isExampleMode} />}
             </div>
          </div>
        </div>
    </Modal>
  );
};

export default PlantDetailModal;