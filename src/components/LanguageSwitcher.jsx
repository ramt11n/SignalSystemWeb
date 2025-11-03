import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(newLang);
  };

  const getCurrentLanguageDisplay = () => {
    return i18n.language === 'en' ? 'EN' : 'FA';
  };

  return (
    <button
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label={`Switch to ${i18n.language === 'en' ? 'Persian' : 'English'}`}
    >
      {getCurrentLanguageDisplay()}
    </button>
  );
};

export default LanguageSwitcher;