import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import Modal from './Modal';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const qrCodeRegionId = "qr-code-scanner-region";

const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
    // Using a ref to hold the scanner instance to avoid re-initialization
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            // Ensure the scanner is initialized only once
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode(qrCodeRegionId);
            }
            const html5QrCode = scannerRef.current;

            // Only start the scanner if it's not already scanning
            if (html5QrCode.getState() !== Html5QrcodeScannerState.SCANNING) {
                const successCallback = (decodedText: string) => {
                    onScanSuccess(decodedText);
                };
                
                const errorCallback = (error: any) => {
                    // This callback is called frequently, ignore non-critical errors.
                };

                html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    successCallback,
                    errorCallback
                ).catch(err => {
                    setErrorMessage("No se pudo acceder a la cámara. El permiso fue denegado o ignorado. Por favor, habilita el acceso a la cámara en la configuración de tu navegador para usar el escáner.");
                    console.error("Camera start error:", err);
                });
            }
        }

        // Cleanup function to stop the scanner when the component unmounts or modal closes
        return () => {
            if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
                scannerRef.current.stop()
                    .catch(err => console.error("Failed to stop scanner on cleanup", err));
            }
        };
    }, [isOpen, onScanSuccess]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Escanear Código QR de la Planta">
            <div className="relative w-full aspect-square max-w-md mx-auto bg-background rounded-md overflow-hidden">
                <div id={qrCodeRegionId} style={{ width: '100%', height: '100%' }}></div>
                
                {/* Visual Guide Overlay - pointer-events-none allows clicks to go through to the video */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-[250px] h-[250px]">
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                        
                        {/* Animated scanning line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/70 rounded-full shadow-[0_0_10px_theme(colors.primary)] animate-scan"></div>
                    </div>
                </div>

                 {errorMessage && (
                    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4">
                        <p className="text-red-400 text-center font-semibold">{errorMessage}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default QrScannerModal;