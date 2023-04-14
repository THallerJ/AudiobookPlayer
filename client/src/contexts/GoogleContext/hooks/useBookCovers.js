import { useCallback } from 'react';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useApp } from '../../AppContext/AppContext';

const useBookCovers = (setLibrary, currentBook) => {
  const { axiosInstance } = useApp();
  const [overridedCovers, setOverridedCovers] = useLocalStorage(
    'overridedCovers',
    []
  );

  const getBookCovers = useCallback(
    async (page) => {
      if (currentBook) {
        const response = await axiosInstance.get('/google/getBookCovers', {
          params: { title: currentBook.name, page },
        });

        return response.data;
      }

      return null;
    },
    [axiosInstance, currentBook]
  );

  const updateBookCover = useCallback(
    (newCoverUrl) => {
      setLibrary((prevState) => {
        return prevState.map((obj) => {
          if (obj.id === currentBook.id)
            return { ...obj, coverImageUrl: newCoverUrl };

          return obj;
        });
      });
    },
    [currentBook, setLibrary]
  );

  return {
    overridedCovers,
    setOverridedCovers,
    getBookCovers,
    updateBookCover,
  };
};

export default useBookCovers;
