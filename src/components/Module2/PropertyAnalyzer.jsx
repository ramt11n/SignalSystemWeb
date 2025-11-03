import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PropertyCard from './PropertyCard';

const PropertyAnalyzer = () => {
  const { t } = useTranslation();
  const [equation, setEquation] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeSystem = async () => {
    if (!equation.trim()) {
      setError(t('common.invalidExpression'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For demo purposes, we'll use a mock analysis
      // In production, this would call the backend API
      const mockAnalysis = analyzeSystemProperties(equation);
      setAnalysisResult(mockAnalysis);
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const analyzeSystemProperties = (eq) => {
    // Mock analysis logic - in production, this would be handled by the backend
    const lowerEq = eq.toLowerCase();

    return {
      linearity: {
        result: !lowerEq.includes('x[') || !lowerEq.includes('^2') && !lowerEq.includes('*x['),
        explanation: lowerEq.includes('^2')
          ? 'explanations.nonLinearSquare'
          : 'explanations.linearSystem'
      },
      causality: {
        result: !lowerEq.includes('x[t+1]') && !lowerEq.includes('x[n+1]'),
        explanation: lowerEq.includes('x[t+1]') || lowerEq.includes('x[n+1]')
          ? 'explanations.nonCausalFuture'
          : 'explanations.causalPastInput'
      },
      stability: {
        result: !lowerEq.includes('t*') && !lowerEq.includes('n*'),
        explanation: lowerEq.includes('t*') || lowerEq.includes('n*')
          ? 'explanations.unstableRamp'
          : 'explanations.stableSystem'
      },
      memory: {
        result: lowerEq.includes('x[t-1]') || lowerEq.includes('y[t-1]') ||
                lowerEq.includes('x[n-1]') || lowerEq.includes('y[n-1]'),
        explanation: lowerEq.includes('x[t-1]') || lowerEq.includes('y[t-1]') ||
                     lowerEq.includes('x[n-1]') || lowerEq.includes('y[n-1]')
          ? 'explanations.memoryPastInput'
          : 'explanations.memorylessCurrent'
      },
      timeInvariance: {
        result: !lowerEq.includes('t*') && !lowerEq.includes('n*'),
        explanation: lowerEq.includes('t*') || lowerEq.includes('n*')
          ? 'explanations.timeVariant'
          : 'explanations.timeInvariant'
      }
    };
  };

  const clearResults = () => {
    setEquation('');
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="fade-in">
      <div className="module-header">
        <h1 className="module-title">{t('nav.module2')}</h1>
        <p className="module-description">
          Enter a system equation to analyze its properties such as linearity, causality,
          stability, memory, and time invariance.
        </p>
      </div>

      <Container>
        <Row className="mb-4">
          <Col lg={8} className="mx-auto">
            <Card className="module-card">
              <Card.Body>
                <Form onSubmit={(e) => { e.preventDefault(); analyzeSystem(); }}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="equation-input">
                      {t('labels.enterEquation')}
                    </Form.Label>
                    <Form.Control
                      id="equation-input"
                      type="text"
                      value={equation}
                      onChange={(e) => setEquation(e.target.value)}
                      placeholder="e.g., y(t) = 2*x(t) + 1"
                      className="text-center"
                    />
                    <Form.Text className="text-muted">
                      Example: y(t) = 2*x(t) + 1, y[n] = x[n]^2, y(t) = t*x(t)
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button
                      variant="primary"
                      onClick={analyzeSystem}
                      disabled={loading}
                      className="px-4"
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" />
                          {' '}{t('common.loading')}
                        </>
                      ) : (
                        t('buttons.analyze')
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
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {analysisResult && (
          <Row xs={1} md={2} lg={3} className="g-4">
            <Col>
              <PropertyCard
                property="linearity"
                result={analysisResult.linearity.result}
                explanation={analysisResult.linearity.explanation}
              />
            </Col>
            <Col>
              <PropertyCard
                property="causality"
                result={analysisResult.causality.result}
                explanation={analysisResult.causality.explanation}
              />
            </Col>
            <Col>
              <PropertyCard
                property="stability"
                result={analysisResult.stability.result}
                explanation={analysisResult.stability.explanation}
              />
            </Col>
            <Col>
              <PropertyCard
                property="memory"
                result={analysisResult.memory.result}
                explanation={analysisResult.memory.explanation}
              />
            </Col>
            <Col>
              <PropertyCard
                property="timeInvariance"
                result={analysisResult.timeInvariance.result}
                explanation={analysisResult.timeInvariance.explanation}
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default PropertyAnalyzer;