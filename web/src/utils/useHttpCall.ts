import { useCallback, useState } from 'react';
import { BACKEND } from '../global/urls';
import { useIsMounted } from './useIsMounted';

interface UseHttpCallArgs {
  method: 'POST' | 'GET';
  path: string;
  accessToken?: string;
}

interface CallOptions<RESPONSE, REQUEST> {
  body: REQUEST;

  onSuccess?(response: RESPONSE): void;
}

export const useHttpCall = <RESPONSE = undefined, REQUEST = undefined>({
                                                                         method = 'GET',
                                                                         path,
                                                                         accessToken,
                                                                       }: UseHttpCallArgs) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<RESPONSE>();

  const isMountedRef = useIsMounted();

  const makeCall = useCallback(async ({ body, onSuccess }: CallOptions<RESPONSE, REQUEST>) => {
    const isMounted = isMountedRef.current;
    setLoading(true);
    try {
      const httpResponse = await fetch(`${BACKEND}/${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? {
            'Authorization': `Bearer ${accessToken}`,
          } : {}),
        },
        body: JSON.stringify(body),
      });

      if (httpResponse.ok) {
        const responseData = await httpResponse.json() as RESPONSE;
        if (isMounted()) {
          setLoading(false);
          setData(responseData);
          onSuccess?.(responseData);
        }
      } else if (isMounted()) {
        setLoading(false);
        setError(true);
      }
    } catch {
      if (isMounted()) {
        setLoading(false);
        setError(true);
      }
    }
  }, [accessToken, method, isMountedRef, path]);

  return {
    data,
    error,
    loading,
    makeCall,
  };
};
