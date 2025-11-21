import React, { useRef, useEffect, useState, useCallback } from 'react';
import { EyeDropperIcon } from './icons/EyeDropperIcon';

interface ImageColorPickerProps {
  imageUrl: string;
  onColorSelect: (hex: string) => void;
  onClose: () => void;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}


const ImageColorPicker: React.FC<ImageColorPickerProps> = ({ imageUrl, onColorSelect, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoverColor, setHoverColor] = useState<string>('#FFFFFF');

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (!canvas || !ctx) return;
        
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageUrl;
        image.onload = () => {
            const container = canvas.parentElement;
            if (container) {
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                const imgAspectRatio = image.width / image.height;
                const containerAspectRatio = containerWidth / containerHeight;

                let drawWidth, drawHeight;

                if (imgAspectRatio > containerAspectRatio) {
                    drawWidth = containerWidth;
                    drawHeight = containerWidth / imgAspectRatio;
                } else {
                    drawHeight = containerHeight;
                    drawWidth = containerHeight * imgAspectRatio;
                }
                
                canvas.width = drawWidth;
                canvas.height = drawHeight;
                ctx.drawImage(image, 0, 0, drawWidth, drawHeight);
            }
        };
    }, [imageUrl]);

    const pickColor = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        return hex;
    }, []);

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const hex = pickColor(event);
        if (hex) setHoverColor(hex);
    };

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const hex = pickColor(event);
        if (hex) onColorSelect(hex);
    };

    return (
        <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-base-200 rounded-2xl shadow-2xl p-6 w-full max-w-4xl h-[80vh] max-h-[800px] flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-base-300 pb-3">
                    <div className="flex items-center gap-3">
                        <EyeDropperIcon className="w-6 h-6 text-brand-primary" />
                        <h2 className="text-xl font-bold">Chọn một màu</h2>
                    </div>
                     <div className="flex items-center gap-4">
                        <span className="text-sm text-content-200">Màu đang trỏ:</span>
                        <div className="w-8 h-8 rounded-full border-2 border-content-100" style={{ backgroundColor: hoverColor }}></div>
                        <span className="font-mono text-content-100">{hoverColor}</span>
                    </div>
                </div>

                <div className="flex-grow flex items-center justify-center overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        onMouseMove={handleMouseMove}
                        onClick={handleClick}
                        className="cursor-crosshair rounded-lg shadow-md"
                    />
                </div>
                
                 <div className="flex justify-end items-center gap-4 pt-4 border-t border-base-300">
                    <p className="text-sm text-content-200 mr-auto">Di chuyển con trỏ trên ảnh và nhấp để chọn màu.</p>
                    <button onClick={onClose} className="py-2 px-5 rounded-lg bg-base-300 hover:bg-base-100/50 transition-colors">Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default ImageColorPicker;