import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const CustomNavbar = () => {
  const { t } = useTranslation();

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-0">
      <Container fluid>
        <BootstrapNavbar.Brand href="/" className="fw-bold">
          {t('nav.title')}
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="text-light">
              {t('nav.module1')}
            </Nav.Link>
            <Nav.Link href="/module2" className="text-light">
              {t('nav.module2')}
            </Nav.Link>
            <Nav.Link href="/module3" className="text-light">
              {t('nav.module3')}
            </Nav.Link>
            <Nav.Link href="/module4" className="text-light">
              {t('nav.module4')}
            </Nav.Link>
            <Nav.Link href="/module5" className="text-light">
              {t('nav.module5')}
            </Nav.Link>
            <Nav.Link href="/module6" className="text-light">
              {t('nav.module6')}
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center">
            <LanguageSwitcher />
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default CustomNavbar;