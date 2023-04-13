import { useApp } from '../../AppContext/AppContext';
import useEffectSkipFirst from '../../../hooks/useEffectSkipFirst';
import useFetchProgress from '../../../hooks/useFetchProgress';

const useFetchLibrary = (setLibrary, overridedCovers) => {
  const { axiosInstance, googleDirectoryExists, rootUpdatedAt } = useApp();

  const fetchLibrary = async () => {
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
  };

  const [isLoadingLibrary, loadLibrary] = useFetchProgress(fetchLibrary);
  const [isRefreshingLibrary, refreshLibrary] = useFetchProgress(fetchLibrary);

  useEffectSkipFirst(() => {
    loadLibrary();
  }, [rootUpdatedAt]);

  return {
    isLoadingLibrary,
    loadLibrary,
    isRefreshingLibrary,
    refreshLibrary,
  };
};

export default useFetchLibrary;
