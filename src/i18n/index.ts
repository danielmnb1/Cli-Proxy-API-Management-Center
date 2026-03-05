/**
 * Configuración de internacionalización i18next
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';
import ru from './locales/ru.json';
import es from './locales/es.json';
import { getInitialLanguage } from '@/utils/language';

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCN },
    en: { translation: en },
    ru: { translation: ru },
    es: { translation: es }
  },
  lng: getInitialLanguage(),
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false // React ya realiza el escape
  },
  react: {
    useSuspense: false
  }
});

export default i18n;
