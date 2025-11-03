import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Plot from 'react-plotly.js';

const LaplaceCalculator = () => {
  const { t } = useTranslation();
  const [expression, setExpression] = useState('exp(-2*t)*u(t)');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateTransform = async () => {
    if (!expression.trim()) {
      setError(t('common.invalidExpression'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock Laplace transform calculation - in production, this would call the backend API
      const mockResult = calculateMockLaplace(expression);
      setResult(mockResult);
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const calculateMockLaplace = (expr) => {
    // Mock Laplace transform results based on common patterns
    const lowerExpr = expr.toLowerCase();

    let transform = '1/(s + 2)';
    let roc = 'Re(s) > -2';
    let poles = [-2];
    let zeros = [];

    if (lowerExpr.includes('exp(-')) {
      const match = lowerExpr.match(/exp\(-(\d+(?:\.\d+)?)\*t\)/);
      if (match) {
        const a = parseFloat(match[1]);
        transform = `1/(s + ${a})`;
        roc = `Re(s) > -${a}`;
        poles = [-a];
      }
    } else if (lowerExpr.includes('u(t)')) {
      transform = '1/s';
      roc = 'Re(s) > 0';
      poles = [0];
    } else if (lowerExpr.includes('sin')) {
      transform = '1/(s^2 + 1)';
      roc = 'Re(s) > 0';
      poles = [0, 0];
      zeros = [];
    } else if (lowerExpr.includes('cos')) {
      transform = 's/(s^2 + 1)';
      roc = 'Re(s) > 0';
      poles = [0, 0];
      zeros = [0];
    } else if (lowerExpr.includes('t*u(t)')) {
      transform = '1/s^2';
      roc = 'Re(s) > 0';
      poles = [0, 0];
    }

    return {
      inputExpression: expr,
      transform: transform,
      roc: roc,
      poles: poles,
      zeros: zeros,
      plotData: generatePoleZeroPlot(poles, zeros)
    };
  };

  const generatePoleZeroPlot = (poles, zeros) => {
    return [
      {
        x: zeros.map(z => z === 0 ? 0 : z),
        y: zeros.map(() => 0),
        type: 'scatter',
        mode: 'markers',
        name: 'Zeros',
        marker: { color: 'blue', size: 12, symbol: 'circle-open' }
      },
      {
        x: poles.map(p => p === 0 ? 0 : p),
        y: poles.map(() => 0),
        type: 'scatter',
        mode: 'markers',
        name: 'Poles',
        marker: { color: 'red', size: 12, symbol: 'x' }
      },
      {
        x: [-10, 10],
        y: [0, 0],
        type: 'scatter',
        mode: 'lines',
        line: { color: 'black', width: 1 },
        showlegend: false
      },
      {
        x: [0, 0],
        y: [-10, 10],
        type: 'scatter',
        mode: 'lines',
        line: { color: 'black', width: 1 },
        showlegend: false
      }
    ];
  };

  const clearResults = () => {
    setExpression('exp(-2*t)*u(t)');
    setResult(null);
    setError('');
  };

  return (
    <div className="fade-in">
      <div className="module-header">
        <h1 className="module-title">{t('nav.module4')}</h1>
        <p className="module-description">
          Calculate the Laplace transform of time-domain signals and visualize the pole-zero plot.
          Enter expressions like exp(-2*t)*u(t), sin(t)*u(t), or t*u(t).
        </p>
      </div>

      <Container>
        <Row className="mb-4">
          <Col lg={8} className="mx-auto">
            <Card className="module-card">
              <Card.Body>
                <Form onSubmit={(e) => { e.preventDefault(); calculateTransform(); }}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="expression-input">
                      {t('labels.enterExpression')}
                    </Form.Label>
                    <Form.Control
                      id="expression-input"
                      type="text"
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      placeholder="e.g., exp(-2*t)*u(t)"
                      className="text-center"
                    />
                    <Form.Text className="text-muted">
                      Supported: exp(-a*t), sin(ωt), cos(ωt), t*u(t), u(t)
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button
                      variant="primary"
                      onClick={calculateTransform}
                      disabled={loading}
                      className="px-4"
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" />
                          {' '}{t('common.loading')}
                        </>
                      ) : (
                        t('buttons.transform')
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={clearResults}
                      className="px-4"
                    >
                      {t('buttons.clear')}
                    </Button>
                  </div>
                </Form>

                {error && (
                  <div className="error-message mt-3">
                    {error}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {result && (
          <Row>
            <Col lg={6}>
              <Card className="module-card">
                <Card.Header>
                  <h5 className="mb-0">{t('labels.result')}</h5>
                </Card.Header>
                <Card.Body>
                  <div className="result-container">
                    <div className="mb-3">
                      <strong>Input:</strong>
                      <div className="math-expression mt-2">
                        f(t) = {result.inputExpression}
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong>Laplace Transform:</strong>
                      <div className="math-expression mt-2">
                        F(s) = {result.transform}
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong>{t('labels.regionOfConvergence')}:</strong>
                      <div className="math-expression mt-2">
                        {result.roc}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="module-card">
                <Card.Header>
                  <h5 className="mb-0">{t('plots.poleZeroPlot')}</h5>
                </Card.Header>
                <Card.Body>
                  <div className="plot-container">
                    <Plot
                      data={result.plotData}
                      layout={{
                        title: 'Pole-Zero Plot',
                        xaxis: { title: 'Real Axis' },
                        yaxis: { title: 'Imaginary Axis' },
                        autosize: true,
                        responsive: true,
                        showlegend: true,
                        xaxis: {
                          range: [-5, 5],
                          zeroline: true,
                          zerolinecolor: 'black',
                          zerolinewidth: 2
                        },
                        yaxis: {
                          range: [-5, 5],
                          zeroline: true,
                          zerolinecolor: 'black',
                          zerolinewidth: 2
                        }
                      }}
                      config={{ responsive: true }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={12} className="mt-3">
              <Card className="module-card">
                <Card.Header>
                  <h5 className="mb-0">System Properties</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6>{t('labels.poles')}:</h6>
                      <ListGroup>
                        {result.poles.map((pole, index) => (
                          <ListGroup.Item key={index}>
                            s = {pole === 0 ? '0' : pole}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <h6>{t('labels.zeros')}:</h6>
                      <ListGroup>
                        {result.zeros.length > 0 ? (
                          result.zeros.map((zero, index) => (
                            <ListGroup.Item key={index}>
                              s = {zero === 0 ? '0' : zero}
                            </ListGroup.Item>
                          ))
                        ) : (
                          <ListGroup.Item>No zeros</ListGroup.Item>
                        )}
                      </ListGroup>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default LaplaceCalculator;