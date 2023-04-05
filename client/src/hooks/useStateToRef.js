import { useEffect, useRef } from 'react';

const useStateToRef = (state) => {
  const ref = useRef(state);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return ref;
};

export default useStateToRef;
