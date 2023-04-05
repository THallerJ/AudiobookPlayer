import { useEffect, useRef } from 'react';
import useLocalStorage from './useLocalStorage';

const useLocalStorageRef = (key, initialValue) => {
  const [value, setValue] = useLocalStorage(key, initialValue);
  const ref = useRef(initialValue);

  useEffect(() => {
    ref.current = value;
  }, [value]);
  return [value, setValue, ref];
};

export default useLocalStorageRef;
