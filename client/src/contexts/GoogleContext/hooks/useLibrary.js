import { useCallback } from 'react';
import { useApp } from '../../AppContext/AppContext';

const useLibrary = (libraryRef) => {
  const { axiosInstance } = useApp();

  const getFolders = useCallback(
    async (directory) => {
      const response = await axiosInstance.get(`/google/folders`, {
        params: {
          directory: directory || null,
        },
      });

      return response.data;
    },
    [axiosInstance]
  );

  const getBookAndChapter = useCallback(
    (bookId, chapterId) => {
      if (libraryRef.current && libraryRef.current.length) {
        const book = libraryRef.current.find(
          (element) => element.id === bookId
        );

        const chapterIndex = book.chapters.findIndex(
          (element) => element.id === chapterId
        );

        return {
          book,
          chapter: { data: book.chapters[chapterIndex], index: chapterIndex },
        };
      }

      return null;
    },
    [libraryRef]
  );

  return { getFolders, getBookAndChapter };
};

export default useLibrary;
