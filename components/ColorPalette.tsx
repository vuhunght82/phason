
import React from 'react';
import { Color } from '../types';

interface ColorPaletteProps {
  colors: Color[];
  selectedColor: Color | null;
  onSelectColor: (color: Color) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, selectedColor, onSelectColor }) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {colors.map((color) => (
        <div 
          key={color.name}
          onClick={() => onSelectColor(color)}
          className="cursor-pointer group flex flex-col items-center gap-2"
          title={color.name}
        >
          <div
            className={`w-16 h-16 rounded-full shadow-md transition-all duration-300 transform group-hover:scale-110 ${
              selectedColor?.hex === color.hex ? 'ring-4 ring-offset-2 ring-offset-base-200 ring-brand-primary' : 'ring-2 ring-transparent'
            }`}
            style={{ backgroundColor: color.hex }}
          />
          <span className={`text-xs text-center transition-colors ${selectedColor?.hex === color.hex ? 'text-brand-primary font-semibold' : 'text-content-200'}`}>
            {color.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ColorPalette;
