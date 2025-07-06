/**
 * Shared API utilities to eliminate duplicate error handling and token management
 */

// Standard error handler for API responses
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.statusText || 'Server error';
    throw new Error(message);
  } else if (error.request) {
    // Network error
    throw new Error('Network error - please check your connection');
  } else {
    // Other error
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Get auth headers with token
export const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Standard API request wrapper
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

// Show success message (could be enhanced with a toast library later)
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
