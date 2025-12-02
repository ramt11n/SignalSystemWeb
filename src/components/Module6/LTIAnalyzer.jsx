import React, { useState } from 'react';
import axios from 'axios'; // 1. IMPORT AXIOS
import { Container, Row, Col, Form, Button, Card, Spinner, Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Plot from 'react-plotly.js';

// 2. GET THE API URL FROM YOUR .env FILE
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LTIAnalyzer = () => {
  const { t } = useTranslation();
  const [transferFunction, setTransferFunction] = useState('1/(s+2)');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeSystem = async () => {
    if (!transferFunction.trim()) {
      setError(t('common.invalidExpression'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 3. THIS IS THE REAL API CALL (REPLACES THE MOCK)
      const response = await axios.post(`${API_BASE_URL}/api/v1/lti/analyze`, {
        transfer_function: transferFunction 
      });
      
      // The backend's JSON response is used to set the result
      setResult(response.data);

    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // 4. ALL MOCK FUNCTIONS (analyzeMockLTI, generate...Response) ARE DELETED
  //    The backend now handles all calculations.

  const clearResults = () => {
    setTransferFunction('1/(s+2)');
    setResult(null);
    setError('');
  };

  const getStabilityBadge = (stability) => {
    // This helper function remains the same
    switch (stability) {
      case 'stable':
        return <span className="badge bg-success">Stable</span>;
      case 'unstable':
        return <span className="badge bg-danger">Unstable</span>;
      case 'marginallyStable':
        return <span className="badge bg-warning">Marginally Stable</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="fade-in">
      <div className="module-header">
        <h1 className="module-title">{t('nav.module6')}</h1>
        <p className="module-description">
          Analyze Linear Time-Invariant (LTI) systems through transfer functions.
          View frequency response, step response, impulse response, and stability analysis.
        </p>
      </div>

      <Container>
        <Row className="mb-4">
          <Col lg={8} className="mx-auto">
            <Card className="module-card">
              <Card.Body>
                <Form onSubmit={(e) => { e.preventDefault(); analyzeSystem(); }}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="tf-input">
                      Transfer Function H(s)
                    </Form.Label>
                    <Form.Control
                      id="tf-input"
                      type="text"
                      value={transferFunction}
                      onChange={(e) => setTransferFunction(e.target.value)}
                      placeholder="e.g., 1/(s+2)"
                      className="text-center"
                    />
                    <Form.Text className="text-muted">
                      Enter transfer function in terms of s
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
                  <div className="error-message mt-3">
                    {error}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* This section will now be populated by the REAL backend data */}
        {result && (
          <>
            <Row className="mb-4">
              <Col lg={8} className="mx-auto">
                <Card className="module-card">
                  <Card.Header>
                    <h5 className="mb-0">System Analysis</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="result-container">
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <strong>Transfer Function:</strong>
                            <div className="math-expression mt-2">
                              H(s) = {result.transferFunction}
                            </div>
                          </div>

                          <div className="mb-3">
                            <strong>DC Gain:</strong>
                            <div className="mt-1">
                              {result.dcGain.toFixed(3)}
                            </div>
                          </div>
                        </Col>

                        <Col md={6}>
                          <div className="mb-3">
                            <strong>Stability:</strong>
                            <div className="mt-2">
                              {getStabilityBadge(result.stability)}
                            </div>
                          </div>

                          <div className="mb-3">
                            <strong>Poles:</strong>
                            <div>
                              {result.poles.map((pole, index) => (
                                <span key={index} className="badge bg-danger me-1">
                                  s = {pole}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mb-3">
                            <strong>Zeros:</strong>
                            <div>
                              {result.zeros.length > 0 ? (
                                result.zeros.map((zero, index) => (
                                  <span key={index} className="badge bg-primary me-1">
                                    s = {zero}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted">No zeros</span>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col lg={10} className="mx-auto">
                <Card className="module-card">
                  <Card.Header>
                    <h5 className="mb-0">System Responses</h5>
                  </Card.Header>
                  <Card.Body>
                    {/* 5. ADDED 'unmountOnExit' TO FIX THE MOBILE LAYOUT BUG */}
                    <Tabs defaultActiveKey="frequency" className="mb-3" unmountOnExit>
                      <Tab eventKey="frequency" title={t('plots.frequencyResponse')}>
                        <div className="plot-container">
                          <Plot
                            data={[
                              {
                                x: result.frequencyResponse.frequencies,
                                y: result.frequencyResponse.magnitude,
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Magnitude (dB)',
                                line: { color: 'blue' }
                              },
                              {
                                x: result.frequencyResponse.frequencies,
                                y: result.frequencyResponse.phase,
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Phase (degrees)',
                                yaxis: 'y2',
                                line: { color: 'red' }
                              }
                            ]}
                            layout={{
                              title: 'Frequency Response',
                              xaxis: { title: 'Frequency (rad/s)' },
                              yaxis: { title: 'Magnitude (dB)' },
                              yaxis2: {
                                title: 'Phase (degrees)',
                                overlaying: 'y',
                                side: 'right'
                              },
                              autosize: true,
                              responsive: true
                            }}
                            config={{ responsive: true }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      </Tab>

                      <Tab eventKey="step" title={t('labels.stepResponse')}>
                        <div className="plot-container">
                          <Plot
                            data={[
                              {
                                x: result.stepResponse.time,
                                y: result.stepResponse.response,
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Step Response',
                                line: { color: 'green' }
                              }
                            ]}
                            layout={{
                              title: 'Step Response',
                              xaxis: { title: 'Time (s)' },
                              yaxis: { title: 'Amplitude' },
                              autosize: true,
                              responsive: true
                            }}
                            config={{ responsive: true }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      </Tab>

                      <Tab eventKey="impulse" title={t('labels.impulseResponse')}>
                        <div className="plot-container">
                          <Plot
                            data={[
                              {
                                x: result.impulseResponse.time,
                                y: result.impulseResponse.response,
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Impulse Response',
                                line: { color: 'orange' }
                              }
                            ]}
                            layout={{
                              title: 'Impulse Response',
                              xaxis: { title: 'Time (s)' },
                              yaxis: { title: 'Amplitude' },
                              autosize: true,
                              responsive: true
                            }}
                            config={{ responsive: true }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      </Tab>
                    </Tabs>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default LTIAnalyzer;