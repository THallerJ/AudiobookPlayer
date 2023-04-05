import { useState, useEffect, useRef } from 'react';

const useStateRef = (initialValue) => {
  const [state, setState] = useState(initialValue);
  const ref = useRef(initialValue);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return [state, setState, ref];
};

export default useStateRef;
