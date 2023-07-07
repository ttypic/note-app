import { MutableRefObject, useLayoutEffect, useRef } from 'react';

/**
 * Helper to store value in ref, in order to use last version in memoized callbacks,
 * without having to recreate callback
 */
export const useValueRef = <T>(value: T): MutableRefObject<T> => {
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
};
