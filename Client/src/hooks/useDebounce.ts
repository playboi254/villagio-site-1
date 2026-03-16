import { useState, useEffect } from 'react';

/**
 * Debounce a value – delays propagation until value stops changing for `delay` ms.
 * Use this for search inputs, filters, etc.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
