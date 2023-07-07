import { ChangeEventHandler, useCallback } from 'react';

type Setter = (nextValue: string) => void;

export const useInputChange = (setter: Setter) => {
  return useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
    setter(event.target.value);
  }, [setter]);
};
