import { useContext, createContext, useState, useMemo } from 'react';
import useLocalStorageRef from '../../hooks/useLocalStorageRef';
import useFetchLibrary from './hooks/useFetchLibrary';
import useBookCovers from './hooks/useBookCovers';
import useLibrary from './hooks/useLibrary';

const GoogleContext = createContext();

export const GoogleContextProvider = ({ children }) => {
  const [library, setLibrary, libraryRef] = useLocalStorageRef('library', []);
  const [currentBook, setCurrentBook] = useState();
  const [playingBook, setPlayingBook] = useState();
  const [playingChapter, setPlayingChapter] = useState();

  const {
    overridedCovers,
    setOverridedCovers,
    getBookCovers,
    updateBookCover,
  } = useBookCovers(setLibrary, currentBook);

  const { isLoadingLibrary, loadLibrary, isRefreshingLibrary, refreshLibrary } =
    useFetchLibrary(setLibrary, overridedCovers);

  const { getFolders, getBookAndChapter } = useLibrary(libraryRef);

  const value = useMemo(
    () => ({
      getFolders,
      library,
      refreshLibrary,
      loadLibrary,
      currentBook,
      setCurrentBook,
      playingBook,
      setPlayingBook,
      setPlayingChapter,
      playingChapter,
      getBookAndChapter,
      getBookCovers,
      updateBookCover,
      setOverridedCovers,
      isLoadingLibrary,
      isRefreshingLibrary,
    }),
    [
      getFolders,
      library,
      refreshLibrary,
      loadLibrary,
      currentBook,
      setCurrentBook,
      playingBook,
      setPlayingBook,
      setPlayingChapter,
      playingChapter,
      getBookAndChapter,
      getBookCovers,
      updateBookCover,
      setOverridedCovers,
      isLoadingLibrary,
      isRefreshingLibrary,
    ]
  );

  return (
    <GoogleContext.Provider value={value}>{children}</GoogleContext.Provider>
  );
};

export const useGoogle = () => useContext(GoogleContext);
