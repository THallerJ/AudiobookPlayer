import { useCallback, useRef } from 'react';
import { useApp } from '../../AppContext/AppContext';
import useEffectSkipFirst from '../../../hooks/useEffectSkipFirst';
import useFetchProgressCallback from '../../../hooks/useFetchProgressCallback';

const useFetchLibrary = (setLibrary, overridedCovers) => {
  const { axiosInstance, googleDirectoryExists, rootUpdatedAt } = useApp();
  const init = useRef(false);

  const fetchLibrary = useCallback(async () => {
    if (googleDirectoryExists) {
      const response = await axiosInstance.get(`/google/library`);
      const sortedLibrary = response.data.sort((book1, book2) => {
        overridedCovers.forEach((cover) => {
          if (cover.id === book1.id) {
            book1.coverImageUrl = cover.coverImageUrl;
          } else if (cover.id === book2.id) {
            book2.coverImageUrl = cover.coverImageUrl;
          }
        });

        return book1.name.localeCompare(book2.name);
      });

      setLibrary(sortedLibrary);
    }
  }, [axiosInstance, googleDirectoryExists, setLibrary, overridedCovers]);

  const [isLoadingLibrary, loadLibrary] =
    useFetchProgressCallback(fetchLibrary);
  const [isRefreshingLibrary, refreshLibrary] =
    useFetchProgressCallback(fetchLibrary);

  useEffectSkipFirst(() => {
    if (init.current === true) loadLibrary();
    init.current = true;
  }, [rootUpdatedAt, loadLibrary, init]);

  return {
    isLoadingLibrary,
    isRefreshingLibrary,
    refreshLibrary,
  };
};

export default useFetchLibrary;
