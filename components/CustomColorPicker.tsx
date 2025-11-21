import React, { useRef } from 'react';
import { Color } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { useTranslation } from '../context/LanguageContext';

interface CustomColorPickerProps {
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    customColor: Color | null;
    onSelectColor: (color: Color) => void;
    isSelected: boolean;
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ onImageUpload, customColor, onSelectColor, isSelected }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    return (
        <div className="flex items-center gap-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={onImageUpload}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
            />
            <button
                onClick={handleUploadClick}
                className="flex flex-col items-center justify-center w-28 h-20 bg-base-300 rounded-lg border-2 border-dashed border-base-100 hover:border-brand-primary transition-colors text-content-200 hover:text-brand-primary"
            >
                <UploadIcon className="w-6 h-6 mb-1" />
                <span className="text-xs text-center font-medium">{t('uploadButton')}</span>
            </button>
            {customColor && (
                 <div 
                    onClick={() => onSelectColor(customColor)}
                    className="cursor-pointer group flex flex-col items-center gap-2"
                    title={customColor.name}
                >
                    <div
                        className={`w-16 h-16 rounded-full shadow-md transition-all duration-300 transform group-hover:scale-110 ${
                        isSelected ? 'ring-4 ring-offset-2 ring-offset-base-200 ring-brand-primary' : 'ring-2 ring-transparent'
                        }`}
                        style={{ backgroundColor: customColor.hex }}
                    />
                    <span className={`text-xs text-center transition-colors ${isSelected ? 'text-brand-primary font-semibold' : 'text-content-200'}`}>
                        {t('customColorName')}
                    </span>
                </div>
            )}
        </div>
    );
};

export default CustomColorPicker;