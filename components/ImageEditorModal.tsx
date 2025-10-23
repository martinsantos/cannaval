import React, { useState, useRef } from 'react';
import Modal from './Modal';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { RotateClockwiseIcon, RotateCounterClockwiseIcon } from './Icons';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (base64Image: string) => void;
  imageSrc: string;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, onClose, onSave, imageSrc }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [rotation, setRotation] = useState(0);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }

  const handleRotate = (degrees: number) => {
    setRotation(prev => (prev + degrees + 360) % 360);
  };

  const handleSave = () => {
    if (!completedCrop || !imgRef.current) {
      console.error("Crop or image ref is not available.");
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Adjust canvas size based on rotation
    if (rotation === 90 || rotation === 270) {
        canvas.width = cropHeight;
        canvas.height = cropWidth;
    } else {
        canvas.width = cropWidth;
        canvas.height = cropHeight;
    }
    
    // Perform transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation * Math.PI / 180);

    // Draw the cropped image onto the transformed canvas
    ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        -cropWidth / 2, // Center the image
        -cropHeight / 2,
        cropWidth,
        cropHeight
    );
    
    const base64Image = canvas.toDataURL('image/jpeg', 0.9);
    onSave(base64Image);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Foto de la Planta">
        <div className="flex flex-col items-center">
            <div className="max-h-[60vh] overflow-auto bg-background p-2 rounded-md">
                 <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imageSrc}
                        style={{ transform: `rotate(${rotation}deg)` }}
                        onLoad={onImageLoad}
                        className="max-h-[55vh] object-contain"
                    />
                </ReactCrop>
            </div>
           
            <div className="mt-4 flex items-center justify-center gap-4">
                <button onClick={() => handleRotate(-90)} className="p-2 bg-subtle rounded-full hover:bg-slate-600 transition" title="Girar a la Izquierda">
                    <RotateCounterClockwiseIcon />
                </button>
                <span className="text-lg font-semibold w-16 text-center">{rotation}°</span>
                 <button onClick={() => handleRotate(90)} className="p-2 bg-subtle rounded-full hover:bg-slate-600 transition" title="Girar a la Derecha">
                    <RotateClockwiseIcon />
                </button>
            </div>
        </div>
        <div className="flex justify-end gap-2 pt-6 border-t border-subtle mt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-subtle text-light font-semibold rounded-md hover:bg-slate-600 transition">Cancelar</button>
            <button type="button" onClick={handleSave} className="py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition">Recortar y Guardar</button>
        </div>
    </Modal>
  );
};

export default ImageEditorModal;