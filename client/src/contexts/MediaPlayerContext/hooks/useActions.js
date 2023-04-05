import { useGoogle } from '../../GoogleContext/GoogleContext';

const useActions = ({
  sound,
  isPlaying,
  setIsPlaying,
  isMuted,
  setIsMuted,
  rate,
  setRate,
  progress,
  setProgress,
  soundLoaded,
}) => {
  const { setPlayingChapter, playingChapter, playingBook } = useGoogle();

  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
        setIsPlaying(false);
      } else {
        sound.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (sound) {
      sound.mute(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const increaseRate = () => {
    if (sound) {
      if (rate < 4) {
        setRate(rate + 0.25);
        sound.rate(rate);
      }
    }
  };

  const decreaseRate = () => {
    if (sound) {
      if (rate > 0.5) {
        setRate(rate - 0.25);
        sound.rate(rate);
      }
    }
  };

  const seekBackward = () => {
    const newProgress = progress - 5;
    if (newProgress > 0 && sound) {
      sound.seek(newProgress);
      setProgress(sound.seek());
    } else {
      sound.seek(0);
      setProgress(0);
    }
  };

  const seekForward = () => {
    const newProgress = progress + 5;

    if (newProgress > 0 && sound) {
      sound.seek(newProgress);
      setProgress(sound.seek());
    } else {
      sound.seek(0);
      setProgress(0);
    }
  };

  const previousTrack = () => {
    if (playingBook) {
      const newIndex = playingChapter.index - 1;
      if (newIndex >= 0)
        setPlayingChapter({
          data: playingBook.chapters[newIndex],
          index: newIndex,
        });
    }
  };

  const nextTrack = () => {
    if (playingBook) {
      const newIndex = playingChapter.index + 1;
      if (newIndex < playingBook.chapters.length)
        setPlayingChapter({
          data: playingBook.chapters[newIndex],
          index: newIndex,
        });
    }
  };

  const handleSeek = (value) => {
    if (sound && soundLoaded) {
      setProgress(value);
      sound.seek(value);
    }
  };

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
  };
};

export default useActions;
