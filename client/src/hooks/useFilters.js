import { useState, useCallback } from 'react';

// these hooks save a ton of duplicate code, might add more utility hooks later
// could probably publish these as a separate package

/**
 * Custom hook for managing filter and pagination state
 * TODO: add URL persistence so filters survive page refresh
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1 // always reset page when filtering, prevents confusion
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...initialFilters
    });
  }, [initialFilters]);

  const setPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  return {
    filters,
    setFilters,
    handleFilterChange,
    resetFilters,
    setPage
  };
};

/**
 * Custom hook for managing loading states and error handling
 * works really well, might add retry logic and cache support
 */
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError
  };
};

/**
 * Custom hook for managing selection state (checkboxes, bulk operations)
 * super useful for inventory management and bulk actions
 */
export const useSelection = (items = []) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemSelect = useCallback((itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item._id || item.id));
    }
  }, [selectedItems.length, items]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const isAllSelected = selectedItems.length === items.length && items.length > 0;
  const hasSelection = selectedItems.length > 0;

  return {
    selectedItems,
    setSelectedItems,
    handleItemSelect,
    handleSelectAll,
    clearSelection,
    isAllSelected,
    hasSelection
  };
};
