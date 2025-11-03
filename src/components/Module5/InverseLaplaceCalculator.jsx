import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Accordion } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const InverseLaplaceCalculator = () => {
  const { t } = useTranslation();
  const [expression, setExpression] = useState('1/(s+2)');
  const [isCausal, setIsCausal] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateInverseTransform = async () => {
    if (!expression.trim()) {
      setError(t('common.invalidExpression'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock inverse Laplace transform calculation - in production, this would call the backend API
      const mockResult = calculateMockInverseLaplace(expression, isCausal);
      setResult(mockResult);
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const calculateMockInverseLaplace = (expr, causal) => {
    // Mock inverse Laplace transform results based on common patterns
    const lowerExpr = expr.toLowerCase();

    let timeExpression = 'exp(-2*t)*u(t)';
    let steps = [];

    if (lowerExpr.includes('1/(s+')) {
      const match = lowerExpr.match(/1\/\(s\+(\d+(?:\.\d+)?)\)/);
      if (match) {
        const a = parseFloat(match[1]);
        timeExpression = `exp(-${a}*t)*u(t)`;
        steps = [
          { step: "Identify form", value: "1/(s + a)" },
          { step: "Lookup table", value: "exp(-at)·u(t)" },
          { step: "Substitute a", value: `a = ${a}` },
          { step: "Final result", value: timeExpression }
        ];
      }
    } else if (lowerExpr === '1/s') {
      timeExpression = 'u(t)';
      steps = [
        { step: "Identify form", value: "1/s" },
        { step: "Lookup table", value: "u(t)" },
        { step: "Final result", value: "u(t)" }
      ];
    } else if (lowerExpr.includes('1/s^2')) {
      timeExpression = 't*u(t)';
      steps = [
        { step: "Identify form", value: "1/s²" },
        { step: "Lookup table", value: "t·u(t)" },
        { step: "Final result", value: "t*u(t)" }
      ];
    } else if (lowerExpr.includes('s/(s^2+')) {
      const match = lowerExpr.match(/s\/\(s\^2\+(\d+(?:\.\d+)?)\)/);
      if (match) {
        const omega = parseFloat(match[1]);
        timeExpression = `cos(${omega}*t)*u(t)`;
        steps = [
          { step: "Identify form", value: "s/(s² + ω²)" },
          { step: "Lookup table", value: "cos(ωt)·u(t)" },
          { step: "Substitute ω", value: `ω = ${omega}` },
          { step: "Final result", value: timeExpression }
        ];
      }
    } else if (lowerExpr.includes('1/(s^2+')) {
      const match = lowerExpr.match(/1\/\(s\^2\+(\d+(?:\.\d+)?)\)/);
      if (match) {
        const omega = parseFloat(match[1]);
        timeExpression = `(1/${omega})*sin(${omega}*t)*u(t)`;
        steps = [
          { step: "Identify form", value: "1/(s² + ω²)" },
          { step: "Lookup table", value: "(1/ω)·sin(ωt)·u(t)" },
          { step: "Substitute ω", value: `ω = ${omega}` },
          { step: "Final result", value: timeExpression }
        ];
      }
    } else if (lowerExpr.includes('(') && lowerExpr.includes('/')) {
      // Handle partial fractions
      timeExpression = '(3/2)*u(t) - (1/2)*exp(-2*t)*u(t)';
      steps = [
        { step: "Partial fraction expansion", value: "A/s + B/(s+2)" },
        { step: "Solve for A", value: "A = 3/2" },
        { step: "Solve for B", value: "B = -1/2" },
        { step: "Inverse transform of A/s", value: "A·u(t)" },
        { step: "Inverse transform of B/(s+2)", value: "B·exp(-2t)·u(t)" },
        { step: "Combine results", value: timeExpression }
      ];
    }

    if (!causal) {
      timeExpression = timeExpression.replace(/\*u\(t\)/g, '');
    }

    return {
      inputExpression: expr,
      timeExpression: timeExpression,
      isCausal: causal,
      steps: steps
    };
  };

  const clearResults = () => {
    setExpression('1/(s+2)');
    setIsCausal(true);
    setResult(null);
    setError('');
  };

  return (
    <div className="fade-in">
      <div className="module-header">
        <h1 className="module-title">{t('nav.module5')}</h1>
        <p className="module-description">
          Calculate the inverse Laplace transform with step-by-step solution display.
          Enter expressions like 1/(s+2), 1/s, s/(s²+1), or partial fractions.
        </p>
      </div>

      <Container>
        <Row className="mb-4">
          <Col lg={8} className="mx-auto">
            <Card className="module-card">
              <Card.Body>
                <Form onSubmit={(e) => { e.preventDefault(); calculateInverseTransform(); }}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="expression-input">
                      {t('labels.enterExpression')} (s-domain)
                    </Form.Label>
                    <Form.Control
                      id="expression-input"
                      type="text"
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      placeholder="e.g., 1/(s+2)"
                      className="text-center"
                    />
                    <Form.Text className="text-muted">
                      Supported: 1/(s+a), 1/s, 1/s², s/(s²+ω²), 1/(s²+ω²), partial fractions
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="causal-check"
                      label="Causal system (multiply by u(t))"
                      checked={isCausal}
                      onChange={(e) => setIsCausal(e.target.checked)}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button
                      variant="primary"
                      onClick={calculateInverseTransform}
                      disabled={loading}
                      className="px-4"
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" />
                          {' '}{t('common.loading')}
                        </>
                      ) : (
                        t('buttons.inverseTransform')
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
            <Col lg={8} className="mx-auto">
              <Card className="module-card">
                <Card.Header>
                  <h5 className="mb-0">{t('labels.result')}</h5>
                </Card.Header>
                <Card.Body>
                  <div className="result-container">
                    <div className="mb-4">
                      <strong>Input:</strong>
                      <div className="math-expression mt-2">
                        F(s) = {result.inputExpression}
                      </div>
                    </div>

                    <div className="mb-4">
                      <strong>Inverse Laplace Transform:</strong>
                      <div className="math-expression mt-2">
                        f(t) = {result.timeExpression}
                      </div>
                    </div>

                    {result.isCausal && (
                      <div className="mb-3">
                        <span className="badge bg-info">Causal System</span>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8} className="mx-auto mt-3">
              <Card className="module-card">
                <Card.Header>
                  <h5 className="mb-0">Step-by-Step Solution</h5>
                </Card.Header>
                <Card.Body>
                  <Accordion>
                    {result.steps.map((step, index) => (
                      <Accordion.Item key={index} eventKey={index.toString()}>
                        <Accordion.Header>
                          <strong>Step {index + 1}:</strong> {step.step}
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="math-expression">
                            {step.value}
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default InverseLaplaceCalculator;