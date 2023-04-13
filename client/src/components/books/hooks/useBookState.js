import { useState, useEffect } from 'react';
import { useGoogle } from '../../../contexts/GoogleContext/GoogleContext';

const useBookState = (book) => {
  const { currentBook, playingBook } = useGoogle();
  const [hasCover, setHasCover] = useState();
  const [showTitleOverlay, setShowTitleOverlay] = useState(false);
  const [showPlayingOverlay, setShowPlayingOverlay] = useState(false);
  const [showSelectedOverlay, setShowSelectedOverlay] = useState(false);

  useEffect(() => {
    setHasCover(book.coverImageUrl);
  }, [book]);

  useEffect(() => {
    if (currentBook) {
      setShowSelectedOverlay(book.name === currentBook.name);
    }
  }, [currentBook, book]);

  useEffect(() => {
    if (playingBook) setShowPlayingOverlay(book.name === playingBook.name);
  }, [playingBook, book]);

  useEffect(() => {
    if (!hasCover) {
      setShowTitleOverlay(true);
    } else {
      setShowTitleOverlay(false);
    }
  }, [hasCover]);

  return {
    hasCover,
    showTitleOverlay,
    setShowTitleOverlay,
    showPlayingOverlay,
    showSelectedOverlay,
  };
};

export default useBookState;
