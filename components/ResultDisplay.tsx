import React from 'react';
import { Formula, Unit, Color } from '../types';
import { BASE_COLORS } from '../constants';
import { useTranslation } from '../context/LanguageContext';

interface ResultDisplayProps {
  formula: Formula | null;
  totalQuantity: number;
  unit: Unit;
  isLoading: boolean;
  error: string | null;
  targetColor: Color | null;
}

const baseColorHexMap = new Map(BASE_COLORS.map(c => [c.name, c.hex]));

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  formula,
  totalQuantity,
  unit,
  isLoading,
  error,
  targetColor,
}) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-content-200">
          <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
          <p className="mt-4 text-lg">{t('resultLoading')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">{t('resultErrorTitle')}</p>
          <p className="text-sm text-center">{error}</p>
        </div>
      );
    }
    
    if (!formula) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-content-200">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-lg">{t('resultPlaceholderTitle')}</p>
          <p className="text-sm text-center">{t('resultPlaceholderDescription')}</p>
        </div>
      );
    }

    // Fix: Ensure that percentage values from the formula object are treated as numbers
    // to resolve TypeScript errors and add runtime robustness.
    const validIngredients = Object.entries(formula)
      .map(([color, percentage]): [string, number] => [color, Number(percentage)])
      .filter(([, percentage]) => percentage > 0);
    const totalPercentage = validIngredients.reduce((sum, [, percentage]) => sum + percentage, 0);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-base-300 rounded-lg">
          <div className="w-10 h-10 rounded-full" style={{backgroundColor: targetColor?.hex}}></div>
          <div>
            <p className="text-sm text-content-200">{t('resultFormulaFor')}</p>
            <p className="font-bold text-lg text-content-100">{targetColor?.name}</p>
          </div>
        </div>
        <ul className="space-y-2">
          {validIngredients.map(([color, percentage]) => {
            // Normalize percentage in case total isn't exactly 100
            const normalizedPercentage = totalPercentage > 0 ? percentage / totalPercentage : 0;
            const amount = (totalQuantity * normalizedPercentage).toFixed(2);
            const colorHex = baseColorHexMap.get(color) || '#808080'; // Default to gray if not found
            return (
              <li key={color} className="flex justify-between items-center p-3 bg-base-100/50 rounded-md">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-5 h-5 rounded-full ring-1 ring-base-300"
                    style={{ backgroundColor: colorHex }}
                  ></div>
                  <span className="font-medium text-content-100">{color}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-brand-yellow">{amount} {unit}</span>
                  <span className="text-sm text-brand-yellow/80 ml-2">({percentage.toFixed(1)}%)</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="h-full min-h-[200px]">
        {renderContent()}
    </div>
  );
};

export default ResultDisplay;