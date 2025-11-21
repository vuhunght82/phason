import React, { useState } from 'react';

interface ApiKeyModalProps {
    onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
    const [key, setKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (key.trim()) {
            onSave(key.trim());
        }
    };

    const instructionsHTML = "Bạn có thể lấy khóa API của mình từ <a href='https://aistudio.google.com/app/apikey' target='_blank' rel='noopener noreferrer' class='text-brand-primary hover:underline'>Google AI Studio</a>.";

    return (
        <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-base-200 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4 text-content-100">Nhập Khóa API Gemini của bạn</h2>
                    <p className="text-content-200 mb-6">Để sử dụng ứng dụng này, vui lòng cung cấp khóa API Google Gemini của riêng bạn. Khóa của bạn được lưu trữ an toàn trong bộ nhớ cục bộ của trình duyệt và không bao giờ được gửi đến máy chủ của chúng tôi.</p>
                    <div className="mb-4">
                        <label htmlFor="apiKeyInput" className="block text-sm font-medium text-content-200 mb-1">Khóa API Google Gemini</label>
                        <input
                            id="apiKeyInput"
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="w-full bg-base-300 text-content-100 placeholder-content-200/50 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                            placeholder="Nhập khóa API của bạn tại đây"
                            required
                        />
                    </div>
                     <p className="text-xs text-content-200 mb-6" dangerouslySetInnerHTML={{ __html: instructionsHTML }} />
                    <button
                        type="submit"
                        disabled={!key.trim()}
                        className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Lưu và Tiếp tục
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApiKeyModal;