import { useCallback, useEffect, useState } from 'react';

type InitialValue<T> = T | undefined | (() => T | undefined);

export function useSessionStorage<T>(
  key: string,
  initialValue?: InitialValue<T>
) {
  const sessionStorage = window.sessionStorage;

  const getSessionStorageValue = useCallback(() => {
    const value = sessionStorage.getItem(key);

    if (value) return JSON.parse(value);

    if (typeof initialValue === 'function') {
      return (initialValue as () => T | undefined)();
    }

    return initialValue;
  }, [key, initialValue]);

  const [value, setValue] = useState(getSessionStorageValue());

  useEffect(() => {
    if (!value) {
      sessionStorage.removeItem(key);
      return;
    }
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as [T | undefined, typeof setValue];
}
