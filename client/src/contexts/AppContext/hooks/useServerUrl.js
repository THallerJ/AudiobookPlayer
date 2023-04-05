import { useState, useEffect } from 'react';

const useServerUrl = (axiosInstance) => {
  const [serverUrl, setServerUrl] = useState();

  useEffect(() => {
    const getServerUrl = async () => {
      const url = await axiosInstance.get('/general/serverUrl');
      setServerUrl(url.data);
    };

    getServerUrl();
  }, [axiosInstance]);

  return serverUrl;
};

export default useServerUrl;
