import React from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer mt-auto">
      <Container fluid>
        <p className="mb-0">
          {t('footer.designedBy')}
        </p>
      </Container>
    </footer>
  );
};

export default Footer;