import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const CustomNavbar = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active fw-bold' : '';

  return (
    <BootstrapNavbar 
      bg="white" 
      variant="light" 
      expand="lg" 
      sticky="top" 
      className="shadow-sm border-bottom py-3"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          {/* FIX: Use translation keys instead of hardcoded English */}
          <span className="fs-4 fw-bold text-primary">{t('nav.brandMain')}</span>
          <span className="fs-4 fw-light text-dark">{t('nav.brandSub')}</span>
        </BootstrapNavbar.Brand>

        {/* Mobile Toggle Button */}
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={toggleSidebar} 
          className="d-lg-none border-0 shadow-none" 
        />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto my-3 my-lg-0 gap-lg-3 d-none d-lg-flex">
            <Nav.Link as={Link} to="/module1" className={`px-3 rounded-pill ${isActive('/') || isActive('/module1')}`}>
              {t('nav.module1')}
            </Nav.Link>
            <Nav.Link as={Link} to="/module2" className={`px-3 rounded-pill ${isActive('/module2')}`}>
              {t('nav.module2')}
            </Nav.Link>
            <Nav.Link as={Link} to="/module3" className={`px-3 rounded-pill ${isActive('/module3')}`}>
              {t('nav.module3')}
            </Nav.Link>
            <Nav.Link as={Link} to="/module4" className={`px-3 rounded-pill ${isActive('/module4')}`}>
              {t('nav.module4')}
            </Nav.Link>
            <Nav.Link as={Link} to="/module5" className={`px-3 rounded-pill ${isActive('/module5')}`}>
              {t('nav.module5')}
            </Nav.Link>
            <Nav.Link as={Link} to="/module6" className={`px-3 rounded-pill ${isActive('/module6')}`}>
              {t('nav.module6')}
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2">
            <LanguageSwitcher />
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default CustomNavbar;