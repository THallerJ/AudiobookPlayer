import { useEffect, useState, useCallback, useRef } from 'react';
import { useGoogle } from '../../GoogleContext/GoogleContext';
import useEffectSkipFirst from '../../../hooks/useEffectSkipFirst';
import { useApp } from '../../AppContext/AppContext';

const useResume = ({
  sound,
  refreshFlagRef,
  setInitializedFlag,
  booksProgress,
  setBooksProgress,
  setProgress,
  setDuration,
}) => {
  const { axiosInstance, authentication, rootUpdatedAt } = useApp();
  const {
    setPlayingChapter,
    playingBook,
    setPlayingBook,
    getBookAndChapter,
    setCurrentBook,
  } = useGoogle();
  const [resumeFlag, setResumeFlag] = useState(false);
  const doFetchProgressRef = useRef(true);

  const resumePlayback = useCallback(
    (bookId) => {
      if (bookId) {
        const bookChap = getBookAndChapter(
          bookId,
          booksProgress[bookId].chapterId
        );
        setPlayingChapter(bookChap.chapter);
        setPlayingBook(bookChap.book);
      }

      setInitializedFlag(true);
      setResumeFlag(true);
    },
    [
      booksProgress,
      setResumeFlag,
      setPlayingBook,
      getBookAndChapter,
      setInitializedFlag,
      setPlayingChapter,
    ]
  );

  useEffectSkipFirst(() => {
    if (sound && resumeFlag) {
      sound.once('play', () => {
        const time = booksProgress[playingBook.id].progress;
        sound.seek(time);
        setResumeFlag(false);
      });
    }

    return () => {
      sound.off('play');
    };
  }, [sound, resumeFlag]);

  // loads book progress on startup
  useEffect(() => {
    const getBookProgress = async () => {
      const response = await axiosInstance.get(`/user/getBooksProgress`);

      if (response.data.length) {
        const reduce = response.data.reduce((map, obj) => {
          map[obj.bookId] = {
            chapterId: obj.chapterId,
            progress: obj.progress,
            duration: obj.duration,
          };
          return map;
        }, {});

        setBooksProgress(reduce);

        const { bookId } = response.data[0];
        const { chapterId } = response.data[0];

        const bookChap = getBookAndChapter(bookId, chapterId);

        if (bookChap) {
          const time = reduce[bookId].progress;
          setProgress(time);
          setDuration(reduce[bookId].duration);
          setPlayingChapter(bookChap.chapter);
          setPlayingBook(bookChap.book);
          setCurrentBook(bookChap.book);
        }
      }

      doFetchProgressRef.current = false;
    };

    if (
      authentication.isAuthenticated &&
      !refreshFlagRef.current &&
      doFetchProgressRef.current
    )
      getBookProgress();
  }, [
    axiosInstance,
    getBookAndChapter,
    setPlayingBook,
    setPlayingChapter,
    setCurrentBook,
    setDuration,
    setProgress,
    rootUpdatedAt,
    authentication,
    refreshFlagRef,
    setBooksProgress,
    doFetchProgressRef,
  ]);

  return resumePlayback;
};

export default useResume;
