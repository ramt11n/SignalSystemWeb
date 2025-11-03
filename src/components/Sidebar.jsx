import React, { useState } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || (path === '/' && location.pathname === '/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const modules = [
    { path: '/module1', key: 'module1' },
    { path: '/module2', key: 'module2' },
    { path: '/module3', key: 'module3' },
    { path: '/module4', key: 'module4' },
    { path: '/module5', key: 'module5' },
    { path: '/module6', key: 'module6' },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline-secondary"
        className="d-md-none position-fixed"
        style={{
          top: '70px',
          [i18n.language === 'fa' ? 'left' : 'right']: '10px',
          zIndex: 1001
        }}
        onClick={toggleSidebar}
      >
        ☰
      </Button>

      {/* Sidebar */}
      <div
        className={`sidebar p-3 ${isCollapsed ? 'collapsed' : ''} ${i18n.language === 'fa' ? 'rtl-layout' : 'ltr-layout'}`}
        style={{
          width: isCollapsed ? '60px' : '250px',
          transition: 'width 0.3s ease'
        }}
      >
        <h5 className={`mb-4 ${isCollapsed ? 'd-none' : ''}`}>
          {t('sidebar.modules')}
        </h5>

        <Nav className="flex-column">
          <Nav.Item>
            <Link
              to="/module1"
              className={`nav-link ${isActive('/module1') ? 'active' : ''}`}
            >
              <span className={isCollapsed ? 'd-none' : ''}>
                {t('nav.module1')}
              </span>
              <span className={isCollapsed ? '' : 'd-none'}>
                M1
              </span>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/module2"
              className={`nav-link ${isActive('/module2') ? 'active' : ''}`}
            >
              <span className={isCollapsed ? 'd-none' : ''}>
                {t('nav.module2')}
              </span>
              <span className={isCollapsed ? '' : 'd-none'}>
                M2
              </span>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/module3"
              className={`nav-link ${isActive('/module3') ? 'active' : ''}`}
            >
              <span className={isCollapsed ? 'd-none' : ''}>
                {t('nav.module3')}
              </span>
              <span className={isCollapsed ? '' : 'd-none'}>
                M3
              </span>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/module4"
              className={`nav-link ${isActive('/module4') ? 'active' : ''}`}
            >
              <span className={isCollapsed ? 'd-none' : ''}>
                {t('nav.module4')}
              </span>
              <span className={isCollapsed ? '' : 'd-none'}>
                M4
              </span>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/module5"
              className={`nav-link ${isActive('/module5') ? 'active' : ''}`}
            >
              <span className={isCollapsed ? 'd-none' : ''}>
                {t('nav.module5')}
              </span>
              <span className={isCollapsed ? '' : 'd-none'}>
                M5
              </span>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/module6"
              className={`nav-link ${isActive('/module6') ? 'active' : ''}`}
            >
              <span className={isCollapsed ? 'd-none' : ''}>
                {t('nav.module6')}
              </span>
              <span className={isCollapsed ? '' : 'd-none'}>
                M6
              </span>
            </Link>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;