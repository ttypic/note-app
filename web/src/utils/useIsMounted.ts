import { MutableRefObject, useLayoutEffect, useRef } from 'react';

type IsMountedFunction = () => boolean;

const isMountedUninitialized: IsMountedFunction = () => {
  if (process.env.NODE_ENV === 'production') {
    console.warn('isMounted function has not been initialized yet');
  } else {
    throw new Error('isMounted function has not been initialized yet');
  }

  return false;
};

/**
 * Returns function ref that compute mountState:
 *  `true` - component is mounted
 *  `false` - component is unmounted
 *
 * Easy to use in async callbacks
 * ```
 *   const isMountedRef = useIsMounted();
 *
 *   const callback = async () => {
 *     const isMounted = isMountedRef.current;
 *     ...
 *     // await smth
 *     if (!isMounted()) return;
 *     // now you can safely use set state
 *   }
 * ```
 */
export function useIsMounted(): MutableRefObject<IsMountedFunction> {
  const ref = useRef<IsMountedFunction>(isMountedUninitialized);

  useLayoutEffect(() => {
    let mounted = true;
    ref.current = () => mounted;
    return () => {
      mounted = false;
    };
  }, []);

  return ref;
}
