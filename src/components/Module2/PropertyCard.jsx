import React from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PropertyCard = ({ property, result, explanation }) => {
  const { t } = useTranslation();

  const getResultText = () => {
    switch (property) {
      case 'linearity':
        return result ? t('results.linear') : t('results.nonLinear');
      case 'causality':
        return result ? t('results.causal') : t('results.nonCausal');
      case 'stability':
        return result ? t('results.stable') : t('results.unstable');
      case 'memory':
        return result ? t('results.hasMemory') : t('results.memoryless');
      case 'timeInvariance':
        return result ? t('results.timeInvariant') : t('results.timeVariant');
      default:
        return result ? t('results.yes') : t('results.no');
    }
  };

  const getResultVariant = () => {
    return result ? 'success' : 'danger';
  };

  return (
    <Card className={`module-card border-${getResultVariant()}`}>
      <Card.Header className={`bg-${getResultVariant()} text-white`}>
        <h5 className="mb-0">{t(`properties.${property}`)}</h5>
      </Card.Header>
      <Card.Body>
        <div className="text-center mb-3">
          <span className={`badge bg-${getResultVariant()} fs-6`}>
            {getResultText()}
          </span>
        </div>
        <Card.Text className="text-muted">
          {t(explanation)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;