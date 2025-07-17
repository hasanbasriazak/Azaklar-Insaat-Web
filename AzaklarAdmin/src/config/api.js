// Admin Panel API Configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5177'
  },
  production: {
    API_BASE_URL: 'http://api.azaklaryapi.com'
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
  // User endpoints
  LOGIN: `${currentConfig.API_BASE_URL}/api/user/login`,
  
  // Project endpoints
  PROJECTS: `${currentConfig.API_BASE_URL}/api/project`,
  PROJECT_BY_ID: (id) => `${currentConfig.API_BASE_URL}/api/project/${id}`,
  UPLOAD_IMAGES: `${currentConfig.API_BASE_URL}/api/project/upload-images`,
  DELETE_IMAGE: (imageId) => `${currentConfig.API_BASE_URL}/api/project/images/${imageId}`,
  
  // Health check
  HEALTH: `${currentConfig.API_BASE_URL}/api/health`
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
      return {
        success: false,
        error: data.message || data.error || 'API request failed',
        validationErrors: data.validationErrors || data.errors || null,
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