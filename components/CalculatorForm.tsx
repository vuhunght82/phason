import React from 'react';
import { Unit, Color, GlassThickness } from '../types';
import { LoadingIcon } from './icons/LoadingIcon';
import { useTranslation } from '../context/LanguageContext';

interface CalculatorFormProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
  unit: Unit;
  setUnit: (unit: Unit) => void;
  onCalculate: () => void;
  isLoading: boolean;
  selectedColor: Color | null;
  compensateForGlass: boolean;
  setCompensateForGlass: (value: boolean) => void;
  glassThickness: GlassThickness;
  setGlassThickness: (value: GlassThickness) => void;
}

const thicknesses: GlassThickness[] = [3, 4, 5, 6, 8, 10];

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  quantity,
  setQuantity,
  unit,
  setUnit,
  onCalculate,
  isLoading,
  selectedColor,
  compensateForGlass,
  setCompensateForGlass,
  glassThickness,
  setGlassThickness
}) => {
  const { t } = useTranslation();
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input to clear, otherwise parse as float
    if (value === '') {
        setQuantity(0);
    } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setQuantity(numValue);
        }
    }
  };
    
  return (
    <div className="space-y-6">
      <div className="relative">
        <label htmlFor="quantity" className="block text-sm font-medium text-content-200 mb-1">
          {t('totalAmountLabel')}
        </label>
        <input
          type="number"
          id="quantity"
          value={quantity === 0 ? '' : quantity}
          onChange={handleQuantityChange}
          placeholder={t('quantityPlaceholder')}
          className="w-full bg-base-300 text-content-100 placeholder-content-200/50 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
        />
        <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-3">
          <span className="text-content-200">{unit}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-content-200 mb-2">
          {t('unitLabel')}
        </label>
        <div className="flex space-x-2 bg-base-300 p-1 rounded-lg">
          <button
            onClick={() => setUnit('g')}
            className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${
              unit === 'g' ? 'bg-brand-primary text-white' : 'text-content-200 hover:bg-base-100/50'
            }`}
          >
            {t('unitWeight')}
          </button>
          <button
            onClick={() => setUnit('ml')}
            className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${
              unit === 'ml' ? 'bg-brand-primary text-white' : 'text-content-200 hover:bg-base-100/50'
            }`}
          >
            {t('unitVolume')}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-base-300 rounded-lg">
        <div>
            <label htmlFor="glass-compensation" className="font-medium text-content-100">
                {t('glassCompensationLabel')}
            </label>
            <p className="text-xs text-content-200/80">{t('glassCompensationDescription')}</p>
        </div>
        <button
            type="button"
            className={`${
                compensateForGlass ? 'bg-brand-primary' : 'bg-base-100'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-base-200`}
            role="switch"
            aria-checked={compensateForGlass}
            onClick={() => setCompensateForGlass(!compensateForGlass)}
        >
            <span
                aria-hidden="true"
                className={`${
                    compensateForGlass ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
      </div>

      {compensateForGlass && (
        <div>
            <label className="block text-sm font-medium text-content-200 mb-2">
                {t('glassThicknessLabel')}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-base-300 p-1 rounded-lg">
                {thicknesses.map((thickness) => (
                    <button
                        key={thickness}
                        onClick={() => setGlassThickness(thickness)}
                        className={`py-2 rounded-md text-xs font-semibold transition-colors ${
                            glassThickness === thickness ? 'bg-brand-primary text-white' : 'text-content-200 hover:bg-base-100/50'
                        }`}
                    >
                        {thickness} mm
                    </button>
                ))}
            </div>
        </div>
       )}
      
      <button
        onClick={onCalculate}
        disabled={isLoading || !selectedColor || quantity <= 0}
        className="w-full flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            {t('generatingButton')}
          </>
        ) : (
          t('generateButton')
        )}
      </button>
    </div>
  );
};

export default CalculatorForm;