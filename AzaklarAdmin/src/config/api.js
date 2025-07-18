// Admin Panel API Configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5177'
  },
  production: {
    API_BASE_URL: 'https://api.azaklaryapi.com'
  }
};

// Environment detection - daha güvenilir yöntem
const isProduction = () => {
  // Vite environment variable
  if (import.meta.env.PROD) return true;
  
  // Window location check
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname === 'admin.azaklaryapi.com' || hostname === 'azaklaryapi.com';
  }
  
  // Default to development
  return false;
};

// Get current environment configuration
const currentConfig = isProduction() ? config.production : config.development;

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: `${currentConfig.API_BASE_URL}/api/user/login`,
  
  // Project endpoints
  PROJECTS: `${currentConfig.API_BASE_URL}/api/project`,
  PROJECTS_UPDATE: `${currentConfig.API_BASE_URL}/api/project/update`,
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

  // Relative path'leri tam URL'e çevir
  const fullUrl = endpoint.startsWith('http') 
    ? endpoint 
    : `${currentConfig.API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(fullUrl, mergedOptions);
    
    // Response text'ini kontrol et
    const responseText = await response.text();
    
    // Boş response kontrolü
    if (!responseText || responseText.trim() === '') {
      console.error('Empty response from API:', fullUrl);
      return {
        success: false,
        error: 'Sunucudan boş yanıt alındı',
        validationErrors: null,
        status: response.status
      };
    }
    
    // JSON parse et
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response text:', responseText);
      return {
        success: false,
        error: 'Sunucudan geçersiz yanıt alındı',
        validationErrors: null,
        status: response.status
      };
    }
    
    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
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
  environment: isProduction() ? 'production' : 'development',
  baseUrl: currentConfig.API_BASE_URL,
  endpoints: API_ENDPOINTS
});

// Debug function to log current configuration
export const debugApiConfig = () => {
  const config = getApiConfig();
  console.log('🔧 API Configuration Debug:', {
    environment: config.environment,
    baseUrl: config.baseUrl,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    isProd: isProduction(),
    viteProd: import.meta.env.PROD
  });
  return config;
};

// API configuration loaded 