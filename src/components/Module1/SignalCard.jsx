import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Plot from 'react-plotly.js';

const SignalCard = ({ signalKey, signalData }) => {
  const { t } = useTranslation();
  const [showPlot, setShowPlot] = useState(false);

  const togglePlot = () => {
    setShowPlot(!showPlot);
  };

  return (
    <Card className="module-card h-100">
      <Card.Header as="h5" className="text-center">
        {t(`signals.${signalKey}`)}
      </Card.Header>
      <Card.Body>
        <div className="math-expression mb-3">
          {signalData.mathExpression}
        </div>

        <Card.Text>
          {t(`signalDescriptions.${signalKey}`)}
        </Card.Text>

        <div className="d-grid gap-2">
          <Button
            variant={showPlot ? "secondary" : "primary"}
            onClick={togglePlot}
          >
            {showPlot ? t('buttons.clear') : t('plots.signalPlot')}
          </Button>
        </div>

        {showPlot && (
          <div className="plot-container mt-3">
            <Plot
              data={signalData.plotData}
              layout={{
                title: t(`signals.${signalKey}`),
                xaxis: { title: 'Time (t)' },
                yaxis: { title: 'Amplitude' },
                autosize: true,
                responsive: true
              }}
              config={{ responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SignalCard;