import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// Property Analyzer API
export const propertyAnalyzerAPI = {
  analyzeSystem: async (equation) => {
    return await api.post('/api/v1/properties/analyze', {
      equation_str: equation
    });
  }
};

// Laplace Transform API
export const laplaceAPI = {
  transform: async (expression) => {
    return await api.post('/api/v1/laplace/transform', {
      expression_t: expression
    });
  },

  inverseTransform: async (expression, isCausal = true) => {
    return await api.post('/api/v1/laplace/inverse', {
      expression_s: expression,
      is_causal: isCausal
    });
  }
};

// Convolution API
export const convolutionAPI = {
  calculate: async (signalX, signalH) => {
    return await api.post('/api/v1/convolution/calculate', {
      signal_x: signalX,
      signal_h: signalH
    });
  }
};

// LTI Analyzer API
export const ltiAPI = {
  analyzeSystem: async (transferFunction) => {
    return await api.post('/api/v1/lti/analyze', {
      transfer_function: transferFunction
    });
  }
};

// Health check API
export const healthAPI = {
  checkHealth: async () => {
    return await api.get('/health');
  },

  checkServiceHealth: async (service) => {
    const endpoints = {
      properties: '/api/v1/properties/health',
      laplace: '/api/v1/laplace/health',
      convolution: '/api/v1/convolution/health',
      lti: '/api/v1/lti/health'
    };

    if (!endpoints[service]) {
      throw new Error(`Unknown service: ${service}`);
    }

    return await api.get(endpoints[service]);
  }
};

// Utility functions
export const apiUtils = {
  // Check if backend is available
  isBackendAvailable: async () => {
    try {
      await healthAPI.checkHealth();
      return true;
    } catch (error) {
      console.warn('Backend not available:', error.message);
      return false;
    }
  },

  // Get API base URL
  getBaseUrl: () => {
    return api.defaults.baseURL;
  },

  // Set API base URL
  setBaseUrl: (url) => {
    api.defaults.baseURL = url;
  }
};

export default api;