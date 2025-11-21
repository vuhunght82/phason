import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useTranslation();

    const buttonClasses = (lang: 'en' | 'vi') => 
        `px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            language === lang 
            ? 'bg-brand-primary text-white' 
            : 'text-content-200 hover:bg-base-300'
        }`;

    return (
        <div className="flex items-center space-x-2 bg-base-200 p-1 rounded-lg">
            <button onClick={() => setLanguage('en')} className={buttonClasses('en')}>
                English
            </button>
            <button onClick={() => setLanguage('vi')} className={buttonClasses('vi')}>
                Tiếng Việt
            </button>
        </div>
    );
};

export default LanguageSwitcher;
