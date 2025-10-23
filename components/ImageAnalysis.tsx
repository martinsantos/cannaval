import React, { useState } from 'react';
import { analyzePlantImage } from '../services/geminiService';
import { toBase64 } from '../utils/imageUtils';
import { Plant, Log } from '../types';
import { CameraIcon } from './Icons';

interface ImageAnalysisProps {
    plant: Plant;
    addLog: (plantId: string, log: Omit<Log, 'id'>) => void;
    onStageSuggestion: (stage: string) => void;
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ plant, addLog, onStageSuggestion }) => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setAnalysis('');
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!image) {
            setError("Por favor, selecciona una imagen primero.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const base64Image = await toBase64(image);
            const result = await analyzePlantImage(base64Image);
            setAnalysis(result);

            // Extract suggested stage and pass it up
            const stageMatch = result.match(/^Etapa Sugerida: (.*)$/m);
            if (stageMatch && stageMatch[1]) {
                onStageSuggestion(stageMatch[1].trim());
            }

            const analysisLog: Omit<Log, 'id'> = {
                date: new Date().toISOString(),
                type: 'Análisis de Imagen',
                notes: `Resultado del Análisis IA:\n${result.substring(0, 200)}...`
            };
            addLog(plant.id, analysisLog);
        } catch (err) {
            setError("Error al analizar la imagen. Revisa la consola para más detalles.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-surface/50 p-4 rounded-lg mt-4 border border-subtle">
            <h3 className="text-xl font-semibold mb-3 text-light flex items-center"><CameraIcon /> Análisis de Imagen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-medium mb-2">Subir Imagen de la Planta</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-subtle border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {preview ? (
                                <img src={preview} alt="Vista previa de la planta" className="mx-auto h-48 w-auto rounded-lg" />
                            ) : (
                                <svg className="mx-auto h-12 w-12 text-medium" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            <div className="flex text-sm text-medium">
                                <label htmlFor="image-upload" className="relative cursor-pointer bg-subtle rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-surface focus-within:ring-primary px-2">
                                    <span>Sube un archivo</span>
                                    <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                </label>
                                <p className="pl-1">o arrastra y suelta</p>
                            </div>
                            <p className="text-xs text-slate-500">PNG, JPG hasta 10MB</p>
                        </div>
                    </div>
                     <button
                        onClick={handleAnalyze}
                        disabled={!image || isLoading}
                        className="mt-4 w-full bg-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-accent/90 disabled:bg-medium disabled:cursor-not-allowed transition duration-300"
                    >
                        {isLoading ? 'Analizando...' : 'Analizar con IA'}
                    </button>
                </div>
                <div>
                     <h4 className="text-lg font-semibold text-light mb-2">Informe de la IA</h4>
                    {isLoading && <div className="text-center p-4">Cargando análisis...</div>}
                    {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
                    {analysis && (
                        <div className="prose prose-invert bg-background p-4 rounded-md max-h-96 overflow-y-auto text-light border border-subtle" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }}>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageAnalysis;