import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 1. RECEIVE THE 'isSidebarOpen' PROP
const Sidebar = ({ isSidebarOpen }) => {
  const { t } = useTranslation();

  // 2. USE THE PROP TO ADD A 'show' CLASS
  return (
    <Nav className={`sidebar-nav ${isSidebarOpen ? 'show' : ''}`}>
      <Nav.Item>
        <Nav.Link as={Link} to="/module1">{t('nav.module1')}</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/module2">{t('nav.module2')}</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/module3">{t('nav.module3')}</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/module4">{t('nav.module4')}</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/module5">{t('nav.module5')}</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/module6">{t('nav.module6')}</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;