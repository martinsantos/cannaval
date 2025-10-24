import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import Modal from './Modal';
import { CameraIcon } from './Icons';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const qrCodeRegionId = "qr-code-scanner-region";
type ScannerState = 'idle' | 'scanning' | 'error_permission' | 'success';

const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [scannerState, setScannerState] = useState<ScannerState>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const cleanupScanner = useCallback(() => {
        const scanner = scannerRef.current;
        if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
            scanner.stop().catch(err => console.error("Error al detener el escáner", err));
        }
        scannerRef.current = null;
    }, []);

    useEffect(() => {
        if (!isOpen) {
            cleanupScanner();
            setScannerState('idle'); // Restablecer estado al cerrar
            setErrorMessage('');
        }
    }, [isOpen, cleanupScanner]);

    const handleStartScan = useCallback(() => {
        setErrorMessage('');
        setScannerState('scanning');

        const successCallback = (decodedText: string) => {
            if (scannerState !== 'success') {
                setScannerState('success');
                onScanSuccess(decodedText);
            }
        };

        const errorCallback = (error: any) => {
            // Ignorar errores menores durante el escaneo
        };
        
        // El elemento del DOM debe estar visible para que Html5Qrcode se inicialice
        // Por eso se inicializa aquí en lugar de en un useEffect
        const scanner = new Html5Qrcode(qrCodeRegionId);
        scannerRef.current = scanner;

        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
            successCallback,
            errorCallback
        ).catch(err => {
            console.error("Error al iniciar la cámara:", err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setErrorMessage("Acceso a la cámara denegado. Por favor, habilita el permiso en la configuración de tu navegador (usualmente en el ícono 🔒 de la barra de direcciones) y vuelve a intentarlo.");
            } else {
                setErrorMessage("No se pudo iniciar la cámara. Asegúrate de que no esté siendo usada por otra aplicación.");
            }
            setScannerState('error_permission');
        });

    }, [onScanSuccess, scannerState]);

    const renderContent = () => {
        switch (scannerState) {
            case 'idle':
            case 'error_permission':
                return (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-background">
                        <CameraIcon />
                        <h3 className="text-xl font-semibold mt-4">Escanear Código QR</h3>
                        <p className="text-medium mt-2 max-w-xs">Se necesita acceso a tu cámara para escanear el código QR de la planta.</p>
                        {errorMessage && (
                            <p className="text-red-400 bg-red-900/20 p-3 mt-4 rounded-md text-sm">{errorMessage}</p>
                        )}
                        <button onClick={handleStartScan} className="mt-6 bg-primary text-white font-bold py-2 px-5 rounded-md hover:bg-primary/90 transition">
                            {scannerState === 'error_permission' ? 'Reintentar' : 'Activar Cámara'}
                        </button>
                    </div>
                );
            case 'scanning':
            case 'success':
                return (
                    <>
                        <div id={qrCodeRegionId} className="w-full h-full"></div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-[250px] h-[250px]">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/70 rounded-full shadow-[0_0_10px_theme(colors.primary)] animate-scan"></div>
                                {scannerState === 'success' && (
                                    <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center rounded-lg animate-fade-in">
                                        <p className="text-white font-bold text-2xl">¡Éxito!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Escanear Código QR de la Planta">
            <div className="relative w-full aspect-square max-w-md mx-auto bg-background rounded-md overflow-hidden">
                {renderContent()}
            </div>
        </Modal>
    );
};

export default QrScannerModal;
