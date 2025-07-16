// API Configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001'
  },
  production: {
    API_BASE_URL: 'http://94.73.149.144:3001'
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
  CONTACT_EMAIL: `${currentConfig.API_BASE_URL}/send-contact-email`,
  KENTSEL_EMAIL: `${currentConfig.API_BASE_URL}/send-kentsel-email`,
  HEALTH: `${currentConfig.API_BASE_URL}/health`
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
      throw new Error(data.message || 'API request failed');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error occurred' 
    };
  }
};

// Export configuration for debugging
export const getApiConfig = () => ({
  environment: isProduction ? 'production' : 'development',
  baseUrl: currentConfig.API_BASE_URL,
  endpoints: API_ENDPOINTS
});

console.log('🔗 API Config loaded:', getApiConfig()); 