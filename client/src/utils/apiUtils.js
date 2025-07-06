// TODO: should add retry logic for failed requests, maybe exponential backoff
// also need proper toast notifications instead of alerts
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    const message = error.response.data?.message || error.response.statusText || 'Server error';
    throw new Error(message);
  } else if (error.request) {
    // Network error - happens a lot with slow connections
    throw new Error('Network error - please check your connection');
  } else {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// TODO: should check token expiry and refresh automatically
export const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// could probably replace this with react-query or swr for better caching
export const apiRequest = async (requestFunction) => {
  try {
    const response = await requestFunction();
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Pagination helper
export const buildPaginationParams = (filters) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params.append(key, value.toString());
    }
  });
  
  return params.toString();
};

// Format currency consistently
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format dates consistently
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// need to add better toast library, maybe react-hot-toast
// alerts are really annoying for users
export const showSuccessMessage = (message) => {
  // For now, use alert - could be replaced with a proper toast notification
  alert(message);
};

// Debounce utility for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
