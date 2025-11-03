import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Plot from 'react-plotly.js';

const ConvolutionEngine = () => {
  const { t } = useTranslation();
  const [signalX, setSignalX] = useState('u(t) - u(t-2)');
  const [signalH, setSignalH] = useState('u(t)');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [error, setError] = useState('');

  const calculateConvolution = async () => {
    if (!signalX.trim() || !signalH.trim()) {
      setError(t('common.invalidExpression'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock convolution calculation - in production, this would call the backend API
      const mockResult = calculateMockConvolution(signalX, signalH);
      setResult(mockResult);
      setAnimationFrame(0);
      setIsPlaying(false);
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const calculateMockConvolution = (x, h) => {
    // Generate mock convolution data
    const timeArray = [];
    const outputArray = [];

    // Create time array from -2 to 6
    for (let t = -2; t <= 6; t += 0.1) {
      timeArray.push(t);

      // Mock convolution: triangular signal for demo
      let value = 0;
      if (t >= 0 && t <= 2) {
        value = t;
      } else if (t > 2 && t <= 4) {
        value = 4 - t;
      }
      outputArray.push(value);
    }

    return {
      timeArray,
      outputArray,
      symbolicResult: 'y(t) = (u(t) - u(t-2)) * u(t)',
      frames: generateAnimationFrames(timeArray, outputArray)
    };
  };

  const generateAnimationFrames = (timeArray, outputArray) => {
    const frames = [];
    const totalFrames = 50;

    for (let i = 0; i <= totalFrames; i++) {
      const progress = i / totalFrames;
      frames.push({
        x: timeArray.slice(0, Math.floor(timeArray.length * progress)),
        y: outputArray.slice(0, Math.floor(outputArray.length * progress))
      });
    }

    return frames;
  };

  useEffect(() => {
    let interval;
    if (isPlaying && result && result.frames) {
      interval = setInterval(() => {
        setAnimationFrame((prev) => {
          if (prev >= result.frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, result]);

  const toggleAnimation = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (animationFrame >= result.frames.length - 1) {
        setAnimationFrame(0);
      }
      setIsPlaying(true);
    }
  };

  const resetAnimation = () => {
    setAnimationFrame(0);
    setIsPlaying(false);
  };

  const clearResults = () => {
    setSignalX('u(t) - u(t-2)');
    setSignalH('u(t)');
    setResult(null);
    setError('');
    setAnimationFrame(0);
    setIsPlaying(false);
  };

  const getCurrentPlotData = () => {
    if (!result || !result.frames || result.frames.length === 0) {
      return [];
    }

    const currentFrame = result.frames[animationFrame];

    return [
      {
        x: currentFrame.x,
        y: currentFrame.y,
        type: 'scatter',
        mode: 'lines',
        name: 'Convolution Result',
        line: { color: 'blue', width: 2 }
      }
    ];
  };

  return (
    <div className="fade-in">
      <div className="module-header">
        <h1 className="module-title">{t('nav.module3')}</h1>
        <p className="module-description">
          Calculate and visualize the convolution of two signals with animated visualization.
          Enter expressions for x(t) and h(t) to see their convolution y(t) = x(t) * h(t).
        </p>
      </div>

      <Container>
        <Row className="mb-4">
          <Col lg={10} className="mx-auto">
            <Card className="module-card">
              <Card.Body>
                <Form onSubmit={(e) => { e.preventDefault(); calculateConvolution(); }}>
                  <Row className="g-3">
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label htmlFor="signal-x">
                          {t('labels.signalX')}
                        </Form.Label>
                        <Form.Control
                          id="signal-x"
                          type="text"
                          value={signalX}
                          onChange={(e) => setSignalX(e.target.value)}
                          placeholder="e.g., u(t) - u(t-2)"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label htmlFor="signal-h">
                          {t('labels.signalH')}
                        </Form.Label>
                        <Form.Control
                          id="signal-h"
                          type="text"
                          value={signalH}
                          onChange={(e) => setSignalH(e.target.value)}
                          placeholder="e.g., u(t)"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button
                        variant="primary"
                        onClick={calculateConvolution}
                        disabled={loading}
                        className="w-100"
                      >
                        {loading ? (
                          <Spinner as="span" animation="border" size="sm" />
                        ) : (
                          t('buttons.calculateConvolution')
                        )}
                      </Button>
                    </Col>
                  </Row>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-3">
                    <Button variant="secondary" onClick={clearResults}>
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
            <Col lg={10} className="mx-auto">
              <Card className="module-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{t('plots.convolutionAnimation')}</h5>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={toggleAnimation}
                      className="me-2"
                    >
                      {isPlaying ? t('buttons.pause') : t('buttons.play')}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={resetAnimation}
                    >
                      {t('buttons.reset')}
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="plot-container">
                    <Plot
                      data={getCurrentPlotData()}
                      layout={{
                        title: 'y(t) = x(t) * h(t)',
                        xaxis: {
                          title: 'Time (t)',
                          range: [-2, 6]
                        },
                        yaxis: {
                          title: 'Amplitude',
                          range: [0, 3]
                        },
                        autosize: true,
                        responsive: true,
                        showlegend: true
                      }}
                      config={{ responsive: true }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>

                  <div className="mt-3">
                    <div className="progress mb-2">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${(animationFrame / (result.frames.length - 1)) * 100}%` }}
                      />
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="math-expression">
                        {result.symbolicResult}
                      </span>
                      <small className="text-muted">
                        Frame: {animationFrame + 1} / {result.frames.length}
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ConvolutionEngine;