import React, { useState, useCallback } from 'react';
import { Color, Formula, Unit, GlassThickness } from './types';
import { TARGET_COLORS } from './constants';
import { getPaintFormula } from './services/geminiService';
import ColorPalette from './components/ColorPalette';
import CalculatorForm from './components/CalculatorForm';
import ResultDisplay from './components/ResultDisplay';
import { PaintBrushIcon } from './components/icons/PaintBrushIcon';
import CustomColorPicker from './components/CustomColorPicker';
import ImageColorPicker from './components/ImageColorPicker';
import { useTranslation } from './context/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState<Color | null>(TARGET_COLORS[5]);
  const [quantity, setQuantity] = useState<number>(1000);
  const [unit, setUnit] = useState<Unit>('g');
  const [formula, setFormula] = useState<Formula | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<Color | null>(null);
  const [compensateForGlass, setCompensateForGlass] = useState<boolean>(true);
  const [glassThickness, setGlassThickness] = useState<GlassThickness>(5);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setUploadedImage(e.target.result);
          setIsPickerOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleColorSelectFromImage = (hex: string) => {
    const newCustomColor = { name: t('customColorTitle', { hex }), hex };
    setCustomColor(newCustomColor);
    setSelectedColor(newCustomColor);
    setIsPickerOpen(false);
  };

  const handleCalculate = useCallback(async () => {
    if (!selectedColor) {
      setError(t('errorSelectColor'));
      return;
    }
    if (quantity <= 0) {
      setError(t('errorInvalidQuantity'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setFormula(null);

    try {
      const generatedFormula = await getPaintFormula(selectedColor.name, selectedColor.hex, compensateForGlass, glassThickness);
      setFormula(generatedFormula);
    } catch (err) {
      console.error(err);
      setError(t('errorApiFailure'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedColor, quantity, compensateForGlass, glassThickness, t]);

  return (
    <>
      <div className="min-h-screen bg-base-100 text-content-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              <PaintBrushIcon className="w-10 h-10 text-brand-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                {t('appTitle')}
              </h1>
            </div>
            <p className="text-lg text-content-200">
              {t('appDescription')}
            </p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 border-b border-base-300 pb-3">{t('step1Title')}</h2>
              <h3 className="text-lg font-medium text-content-200 mb-3">{t('paletteHeader')}</h3>
              <ColorPalette 
                colors={TARGET_COLORS}
                selectedColor={selectedColor} 
                onSelectColor={setSelectedColor}
              />
               <div className="mt-6 border-t border-base-300 pt-4">
                <h3 className="text-lg font-medium text-content-200 mb-3">{t('uploadHeader')}</h3>
                <CustomColorPicker
                  onImageUpload={handleImageUpload}
                  customColor={customColor}
                  onSelectColor={setSelectedColor}
                  isSelected={!!customColor && selectedColor?.hex === customColor.hex}
                />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="bg-base-200 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 border-b border-base-300 pb-3">{t('step2Title')}</h2>
                <CalculatorForm 
                  quantity={quantity}
                  setQuantity={setQuantity}
                  unit={unit}
                  setUnit={setUnit}
                  onCalculate={handleCalculate}
                  isLoading={isLoading}
                  selectedColor={selectedColor}
                  compensateForGlass={compensateForGlass}
                  setCompensateForGlass={setCompensateForGlass}
                  glassThickness={glassThickness}
                  setGlassThickness={setGlassThickness}
                />
              </div>

              <div className="bg-base-200 p-6 rounded-2xl shadow-lg flex-grow">
                <h2 className="text-2xl font-semibold mb-4 border-b border-base-300 pb-3">{t('step3Title')}</h2>
                <ResultDisplay
                  formula={formula}
                  totalQuantity={quantity}
                  unit={unit}
                  isLoading={isLoading}
                  error={error}
                  targetColor={selectedColor}
                />
              </div>
            </div>
          </main>
          <footer className="text-center mt-12 text-content-200 text-sm flex flex-col items-center gap-4">
              <LanguageSwitcher />
              <p>{t('footerText', { year: new Date().getFullYear() })}</p>
          </footer>
        </div>
      </div>
      {isPickerOpen && uploadedImage && (
        <ImageColorPicker
            imageUrl={uploadedImage}
            onColorSelect={handleColorSelectFromImage}
            onClose={() => setIsPickerOpen(false)}
        />
      )}
    </>
  );
};

export default App;