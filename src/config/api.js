// API Configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5177'
  },
  production: {
    API_BASE_URL: 'https://api.azaklaryapi.com'
  }
};

// Environment detection
const isProduction = import.meta.env.PROD || 
                    window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1';

// Get current environment configuration
const currentConfig = isProduction ? config.production : config.development;

// API Endpoints
export const API_ENDPOINTS = {
  CONTACT_EMAIL: `${currentConfig.API_BASE_URL}/api/email/send-contact-email`,
  KENTSEL_EMAIL: `${currentConfig.API_BASE_URL}/api/email/send-kentsel-email`,
  HEALTH: `${currentConfig.API_BASE_URL}/api/email/health`,
  PROJECTS: `${currentConfig.API_BASE_URL}/api/projects`
};

// Utility function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(endpoint, mergedOptions);
    const data = await response.json();
    
    if (!response.ok) {
      // API'den dönen error ve validationErrors'u da döndür
      return {
        success: false,
        error: data.error || data.message || 'API request failed',
        validationErrors: data.data?.validationErrors || data.errors || null,
        status: response.status
      };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error occurred',
      validationErrors: null,
      status: null
    };
  }
};

// Export configuration for debugging
export const getApiConfig = () => ({
  environment: isProduction ? 'production' : 'development',
  baseUrl: currentConfig.API_BASE_URL,
  endpoints: API_ENDPOINTS
});

// API configuration loaded 