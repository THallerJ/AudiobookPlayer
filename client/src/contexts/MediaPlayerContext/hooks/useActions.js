import { useCallback } from 'react';
import { useGoogle } from '../../GoogleContext/GoogleContext';

const useActions = ({
  sound,
  isPlaying,
  isMuted,
  rate,
  setRate,
  progress,
  setProgress,
  soundLoaded,
  setInitializedFlag,
}) => {
  const { setPlayingChapter, playingChapter, playingBook, setPlayingBook } =
    useGoogle();

  const togglePlay = useCallback(() => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  }, [isPlaying, sound]);

  const playChapter = useCallback(
    (book, chapter) => {
      setPlayingChapter(chapter);
      setPlayingBook(book);
      setInitializedFlag(true);
    },
    [setPlayingBook, setPlayingChapter, setInitializedFlag]
  );

  const toggleMute = useCallback(() => {
    if (sound) {
      sound.mute(!isMuted);
    }
  }, [sound, isMuted]);

  const increaseRate = useCallback(() => {
    if (sound) {
      if (rate < 4) {
        setRate(rate + 0.25);
        sound.rate(rate);
      }
    }
  }, [sound, rate, setRate]);

  const decreaseRate = useCallback(() => {
    if (sound) {
      if (rate > 0.5) {
        setRate(rate - 0.25);
        sound.rate(rate);
      }
    }
  }, [sound, rate, setRate]);

  const seekBackward = useCallback(() => {
    const newProgress = progress - 5;
    if (newProgress > 0 && sound) {
      sound.seek(newProgress);
      setProgress(sound.seek());
    } else {
      sound.seek(0);
      setProgress(0);
    }
  }, [progress, sound, setProgress]);

  const seekForward = useCallback(() => {
    const newProgress = progress + 5;

    if (newProgress > 0 && sound) {
      sound.seek(newProgress);
      setProgress(sound.seek());
    } else {
      sound.seek(0);
      setProgress(0);
    }
  }, [progress, setProgress, sound]);

  const previousTrack = useCallback(() => {
    if (playingBook) {
      const newIndex = playingChapter.index - 1;
      if (newIndex >= 0)
        setPlayingChapter({
          data: playingBook.chapters[newIndex],
          index: newIndex,
        });
    }
  }, [playingBook, setPlayingChapter, playingChapter]);

  const nextTrack = useCallback(() => {
    if (playingBook) {
      const newIndex = playingChapter.index + 1;
      if (newIndex < playingBook.chapters.length)
        setPlayingChapter({
          data: playingBook.chapters[newIndex],
          index: newIndex,
        });
    }
  }, [playingBook, playingChapter, setPlayingChapter]);

  const handleSeek = useCallback(
    (value) => {
      if (sound && soundLoaded) {
        setProgress(value);
        sound.seek(value);
      }
    },
    [sound, soundLoaded, setProgress]
  );

  return {
    togglePlay,
    toggleMute,
    increaseRate,
    decreaseRate,
    seekBackward,
    seekForward,
    previousTrack,
    nextTrack,
    handleSeek,
    playChapter,
  };
};

export default useActions;
