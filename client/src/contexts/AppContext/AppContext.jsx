import { useContext, createContext, useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import useAuthentication from './hooks/useAuthentication';
import useDarkMode from './hooks/useDarkMode';
import useServerUrl from './hooks/useServerUrl';
import useAxios from './hooks/useAxios';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { axiosInstance, axiosError, setAxiosError } = useAxios();
  const {
    authentication,
    setAuthentication,
    googleDirectoryExists,
    setGoogleDirectoryExists,
  } = useAuthentication();
  const { theme, darkModeEnabled, toggleDarkMode } = useDarkMode();
  const serverUrl = useServerUrl(axiosInstance);
  const [rootUpdatedAt, setRootUpdatedAt] = useLocalStorage(
    'rootUpdatedAt',
    null
  );

  const value = useMemo(
    () => ({
      authentication,
      setAuthentication,
      googleDirectoryExists,
      setGoogleDirectoryExists,
      axiosInstance,
      theme,
      toggleDarkMode,
      darkModeEnabled,
      axiosError,
      setAxiosError,
      serverUrl,
      rootUpdatedAt,
      setRootUpdatedAt,
    }),
    [
      authentication,
      setAuthentication,
      googleDirectoryExists,
      setGoogleDirectoryExists,
      axiosInstance,
      theme,
      toggleDarkMode,
      darkModeEnabled,
      axiosError,
      setAxiosError,
      serverUrl,
      rootUpdatedAt,
      setRootUpdatedAt,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
