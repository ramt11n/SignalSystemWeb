import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SignalCard from './SignalCard';

const SignalLibrary = () => {
  const { t } = useTranslation();

  // Generate data for common signals
  const generateTimeArray = (start, end, steps) => {
    const timeArray = [];
    const step = (end - start) / steps;
    for (let i = 0; i <= steps; i++) {
      timeArray.push(start + i * step);
    }
    return timeArray;
  };

  const timeArray = generateTimeArray(-5, 5, 200);

  const signals = {
    unitStep: {
      mathExpression: 'u(t) = { 0, t < 0; 1, t ≥ 0 }',
      plotData: [
        {
          x: timeArray,
          y: timeArray.map(t => t >= 0 ? 1 : 0),
          type: 'scatter',
          mode: 'lines',
          name: 'Unit Step',
          line: { color: 'blue', width: 2 }
        }
      ]
    },
    unitImpulse: {
      mathExpression: 'δ(t) = 0 for t ≠ 0, ∫δ(t)dt = 1',
      plotData: [
        {
          x: [0],
          y: [1],
          type: 'scatter',
          mode: 'markers',
          name: 'Unit Impulse',
          marker: { color: 'red', size: 10 }
        },
        {
          x: timeArray.filter(t => Math.abs(t) > 0.1),
          y: timeArray.filter(t => Math.abs(t) > 0.1).map(() => 0),
          type: 'scatter',
          mode: 'lines',
          line: { color: 'red', width: 1 }
        }
      ]
    },
    sinusoidal: {
      mathExpression: 'sin(2πt)',
      plotData: [
        {
          x: timeArray,
          y: timeArray.map(t => Math.sin(2 * Math.PI * t)),
          type: 'scatter',
          mode: 'lines',
          name: 'Sinusoidal',
          line: { color: 'green', width: 2 }
        }
      ]
    },
    exponential: {
      mathExpression: 'e^(-t)·u(t)',
      plotData: [
        {
          x: timeArray,
          y: timeArray.map(t => t >= 0 ? Math.exp(-t) : 0),
          type: 'scatter',
          mode: 'lines',
          name: 'Exponential Decay',
          line: { color: 'orange', width: 2 }
        }
      ]
    },
    ramp: {
      mathExpression: 'r(t) = { 0, t < 0; t, t ≥ 0 }',
      plotData: [
        {
          x: timeArray,
          y: timeArray.map(t => t >= 0 ? t : 0),
          type: 'scatter',
          mode: 'lines',
          name: 'Ramp',
          line: { color: 'purple', width: 2 }
        }
      ]
    }
  };

  return (
    <div className="fade-in">
      <div className="module-header">
        <h1 className="module-title">{t('nav.module1')}</h1>
        <p className="module-description">
          Explore common signals used in signals and systems analysis.
          Click on any signal to view its mathematical expression and plot.
        </p>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        <Col>
          <SignalCard signalKey="unitStep" signalData={signals.unitStep} />
        </Col>
        <Col>
          <SignalCard signalKey="unitImpulse" signalData={signals.unitImpulse} />
        </Col>
        <Col>
          <SignalCard signalKey="sinusoidal" signalData={signals.sinusoidal} />
        </Col>
        <Col>
          <SignalCard signalKey="exponential" signalData={signals.exponential} />
        </Col>
        <Col>
          <SignalCard signalKey="ramp" signalData={signals.ramp} />
        </Col>
      </Row>
    </div>
  );
};

export default SignalLibrary;