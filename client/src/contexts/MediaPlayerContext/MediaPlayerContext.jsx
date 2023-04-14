import {
  useContext,
  createContext,
  useRef,
  useMemo,
  useCallback,
  useState,
} from 'react';
import useActions from './hooks/useActions';
import useResume from './hooks/useResume';
import useSound from './hooks/useSound';
import useSyncProgress from './hooks/useSyncProgress';

const MediaPlayerContext = createContext();

export const MediaPlayerContextProvider = ({ children }) => {
  const [initializedFlag, setInitializedFlag] = useState(false);
  const refreshFlagRef = useRef(false);

  const useSoundProps = {
    initializedFlag,
    refreshFlagRef,
  };

  const {
    sound,
    setSound,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    rate,
    setRate,
    progress,
    setProgress,
    duration,
    setDuration,
    soundLoaded,
  } = useSound({ ...useSoundProps });

  const useSyncProgressProps = {
    sound,
    isPlaying,
    progress,
    duration,
  };

  const { booksProgress, setBooksProgress } = useSyncProgress({
    ...useSyncProgressProps,
  });

  const useResumeProps = {
    sound,
    refreshFlagRef,
    setInitializedFlag,
    booksProgress,
    setBooksProgress,
    setProgress,
    setDuration,
  };

  const resumePlayback = useResume({ ...useResumeProps });

  const uesActionsProps = {
    sound,
    isPlaying,
    isMuted,
    rate,
    setRate,
    progress,
    setProgress,
    soundLoaded,
    setInitializedFlag,
  };

  const {
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
  } = useActions({ ...uesActionsProps });

  const formatTime = useCallback((seconds) => {
    const time = new Date(seconds * 1000).toISOString();
    return seconds < 3600 ? time.substr(14, 5) : time.substr(11, 8);
  }, []);

  const value = useMemo(
    () => ({
      isPlaying,
      setIsPlaying,
      duration,
      setDuration,
      sound,
      setSound,
      togglePlay,
      increaseRate,
      decreaseRate,
      toggleMute,
      handleSeek,
      formatTime,
      volume,
      setVolume,
      rate,
      setRate,
      progress,
      setProgress,
      seekBackward,
      isMuted,
      setIsMuted,
      previousTrack,
      nextTrack,
      seekForward,
      booksProgress,
      resumePlayback,
      initializedFlag,
      playChapter,
    }),
    [
      isPlaying,
      setIsPlaying,
      duration,
      setDuration,
      sound,
      setSound,
      togglePlay,
      increaseRate,
      decreaseRate,
      toggleMute,
      handleSeek,
      formatTime,
      volume,
      setVolume,
      rate,
      setRate,
      progress,
      setProgress,
      seekBackward,
      isMuted,
      setIsMuted,
      previousTrack,
      nextTrack,
      seekForward,
      booksProgress,
      resumePlayback,
      initializedFlag,
      playChapter,
    ]
  );

  return (
    <MediaPlayerContext.Provider value={value}>
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => useContext(MediaPlayerContext);
