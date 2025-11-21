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
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('gemini-api-key'));
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

  const handleApiKeySave = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };

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
    event.target.value = '';
  };

  const handleColorSelectFromImage = (hex: string) => {
    const newCustomColor = { name: `Tùy chỉnh (${hex})`, hex };
    setCustomColor(newCustomColor);
    setSelectedColor(newCustomColor);
    setIsPickerOpen(false);
  };

  const handleCalculate = useCallback(async () => {
    if (!apiKey) {
      setError("Vui lòng cung cấp khóa API Google Gemini của bạn trước khi tạo công thức.");
      return;
    }
    if (!selectedColor) {
      setError("Vui lòng chọn một màu trước.");
      return;
    }
    if (quantity <= 0) {
      setError("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFormula(null);

    try {
      const generatedFormula = await getPaintFormula(selectedColor.name, selectedColor.hex, compensateForGlass, glassThickness, apiKey);
      setFormula(generatedFormula);
    } catch (err) {
      console.error(err);
      setError("Không thể tạo công thức. AI có thể đang bận hoặc API Key không hợp lệ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedColor, quantity, compensateForGlass, glassThickness, apiKey]);

  return (
    <>
      {!apiKey && <ApiKeyModal onSave={handleApiKeySave} />}
      <div className={`min-h-screen text-content-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-filter duration-300 ${!apiKey ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="w-full max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              <PaintBrushIcon className="w-10 h-10 text-brand-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                AI Pha Sơn
              </h1>
            </div>
            <p className="text-lg text-content-200">
              Chọn màu, nhập số lượng, và để AI tạo công thức pha màu.
            </p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-base-200/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
              <h2 className="text-2xl font-semibold mb-4 border-b border-base-300 pb-3">1. Chọn Màu Mục Tiêu</h2>
              <h3 className="text-lg font-medium text-content-200 mb-3">Từ Bảng Màu</h3>
              <ColorPalette 
                colors={TARGET_COLORS}
                selectedColor={selectedColor} 
                onSelectColor={setSelectedColor}
              />
               <div className="mt-6 border-t border-base-300 pt-4">
                <h3 className="text-lg font-medium text-content-200 mb-3">Hoặc Tải Ảnh Lên</h3>
                <CustomColorPicker
                  onImageUpload={handleImageUpload}
                  customColor={customColor}
                  onSelectColor={setSelectedColor}
                  isSelected={!!customColor && selectedColor?.hex === customColor.hex}
                />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="bg-base-200/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                <h2 className="text-2xl font-semibold mb-4 border-b border-base-300 pb-3">2. Thiết Lập Số Lượng</h2>
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

              <div className="bg-base-200/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex-grow border border-white/50">
                <h2 className="text-2xl font-semibold mb-4 border-b border-base-300 pb-3">3. Xem Công Thức</h2>
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
          <footer className="text-center mt-12 text-content-200 text-sm flex flex-col items-center gap-2">
              <p>{`© ${new Date().getFullYear()} AI Pha Sơn. Hỗ trợ bởi Google Gemini.`}</p>
              <p>Ý tưởng thiết kế bởi Vũ Đình Hưng</p>
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