import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';

interface ApiKeyModalProps {
    onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
    const [key, setKey] = useState('');
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (key.trim()) {
            onSave(key.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-base-200 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4 text-content-100">{t('apiKeyTitle')}</h2>
                    <p className="text-content-200 mb-6">{t('apiKeyDescription')}</p>
                    <div className="mb-4">
                        <label htmlFor="apiKeyInput" className="block text-sm font-medium text-content-200 mb-1">{t('apiKeyLabel')}</label>
                        <input
                            id="apiKeyInput"
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="w-full bg-base-300 text-content-100 placeholder-content-200/50 rounded-lg py-3 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                            placeholder={t('apiKeyPlaceholder')}
                            required
                        />
                    </div>
                     <p className="text-xs text-content-200 mb-6" dangerouslySetInnerHTML={{ __html: t('apiKeyInstructions') }} />
                    <button
                        type="submit"
                        disabled={!key.trim()}
                        className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {t('apiKeySaveButton')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApiKeyModal;
