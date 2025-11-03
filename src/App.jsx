import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Import components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';

// Import modules
import SignalLibrary from './components/Module1/SignalLibrary';
import PropertyAnalyzer from './components/Module2/PropertyAnalyzer';
import ConvolutionEngine from './components/Module3/ConvolutionEngine';
import LaplaceCalculator from './components/Module4/LaplaceCalculator';
import InverseLaplaceCalculator from './components/Module5/InverseLaplaceCalculator';
import LTIAnalyzer from './components/Module6/LTIAnalyzer';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import i18n
import './i18n';

function App() {
  const { i18n } = useTranslation();
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    // Update document language and direction based on current language
    const updateLanguageSettings = () => {
      const lang = i18n.language;

      if (lang === 'fa') {
        // Persian - RTL
        document.documentElement.lang = 'fa';
        document.documentElement.dir = 'rtl';

        // Load RTL Bootstrap CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.rtl.min.css';
        link.id = 'bootstrap-rtl-css';

        // Remove existing LTR CSS if present
        const existingLTR = document.getElementById('bootstrap-ltr-css');
        if (existingLTR) {
          existingLTR.remove();
        }

        // Remove existing RTL CSS if present
        const existingRTL = document.getElementById('bootstrap-rtl-css');
        if (existingRTL) {
          existingRTL.remove();
        }

        document.head.appendChild(link);
      } else {
        // English - LTR
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';

        // Load LTR Bootstrap CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css';
        link.id = 'bootstrap-ltr-css';

        // Remove existing RTL CSS if present
        const existingRTL = document.getElementById('bootstrap-rtl-css');
        if (existingRTL) {
          existingRTL.remove();
        }

        // Remove existing LTR CSS if present
        const existingLTR = document.getElementById('bootstrap-ltr-css');
        if (existingLTR) {
          existingLTR.remove();
        }

        document.head.appendChild(link);
      }

      setCssLoaded(true);
    };

    updateLanguageSettings();

    // Listen for language changes
    const handleLanguageChanged = () => {
      updateLanguageSettings();
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  if (!cssLoaded) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <Router>
      <div className={`app-container ${i18n.language === 'fa' ? 'rtl-layout' : 'ltr-layout'}`}>
        <Navbar />
        <div className="d-flex flex-nowrap">
          <Sidebar />
          <main className="flex-grow-1 p-4">
            <Container fluid>
              <Routes>
                <Route path="/" element={<SignalLibrary />} />
                <Route path="/module1" element={<SignalLibrary />} />
                <Route path="/module2" element={<PropertyAnalyzer />} />
                <Route path="/module3" element={<ConvolutionEngine />} />
                <Route path="/module4" element={<LaplaceCalculator />} />
                <Route path="/module5" element={<InverseLaplaceCalculator />} />
                <Route path="/module6" element={<LTIAnalyzer />} />
              </Routes>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;