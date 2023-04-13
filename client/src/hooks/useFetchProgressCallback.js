import { useState, useCallback } from 'react';

const useFetchProgressCallback = (callback) => {
  const [loading, setLoading] = useState(false);

  const callApi = useCallback(
    async (...args) => {
      setLoading(true);
      await callback(...args);
      setLoading(false);
    },
    [setLoading, callback]
  );

  return [loading, callApi];
};

export default useFetchProgressCallback;
