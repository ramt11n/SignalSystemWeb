import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PropertyCard from './PropertyCard';

// Read the API URL from your .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const response = await axios.post(`${API_BASE_URL}/api/v1/properties/analyze`, {
        equation_str: equation
      });
      
      setAnalysisResult(response.data);

    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setLoading(false);
    }
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
          {t('module2.description', 'Enter a system equation to analyze its properties.')} 
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
                      placeholder={t('module2.placeholder', 'e.g., y(t) = 2*x(t) + 1')}
                      className="text-center"
                    />
                    <Form.Text className="text-muted">
                      {t('module2.example', 'Example: y[n] = x[n]^2, y(t) = t*x(t)')}
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
                // Fixed: Matches LinearityResult schema
                result={analysisResult.linearity.is_linear}
                explanation={analysisResult.linearity.reason_key}
              />
            </Col>
            <Col>
              <PropertyCard
                property="causality"
                // Fixed: Matches CausalityResult schema
                result={analysisResult.causality.is_causal}
                explanation={analysisResult.causality.reason_key}
              />
            </Col>
            <Col>
              <PropertyCard
                property="stability"
                // Fixed: Matches StabilityResult schema
                result={analysisResult.stability.is_stable}
                explanation={analysisResult.stability.reason_key}
              />
            </Col>
            <Col>
              <PropertyCard
                property="memory"
                // Fixed: Matches MemoryResult schema
                result={analysisResult.memory.has_memory}
                explanation={analysisResult.memory.reason_key}
              />
            </Col>
            <Col>
              <PropertyCard
                property="timeInvariance"
                // FIXED: Uses snake_case 'time_invariance' to match backend JSON
                result={analysisResult.time_invariance.is_invariant}
                explanation={analysisResult.time_invariance.reason_key}
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default PropertyAnalyzer;