import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/public/locales/en/common.json';
import si from '@/public/locales/si/common.json';
import ta from '@/public/locales/ta/common.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            si: { translation: si },
            ta: { translation: ta },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'si', 'ta'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
    });

export default i18n;
