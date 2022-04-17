import React, { useContext, useState, useEffect, useCallback } from "react";
import { useGoogle } from "../contexts/GoogleContext";
import { useApp } from "../contexts/AppContext";
import useEffectSkipFirst from "../hooks/useEffectSkipFirst";
import useStateRef from "react-usestateref";
import { Howl } from "howler";

const MediaPlayerContext = React.createContext();

export const MediaPlayerContextProvider = ({ children }) => {
	const {
		setPlayingChapter,
		setCurrentBook,
		setPlayingBook,
		playingChapter,
		playingBook,
		getBookAndChapter,
		rootUpdated,
		isLoadingRefresh,
	} = useGoogle();
	const { axiosInstance, authentication, serverHostName } = useApp();
	const [sound, setSound] = useState();
	const [soundLoaded, setSoundLoaded] = useState(false);
	const [duration, setDuration, durationRef] = useStateRef();
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [volume, setVolume] = useState(0);
	const [rate, setRate, rateRef] = useStateRef(1.0);
	const [progress, setProgress, progressRef] = useStateRef(0);
	const [prevBookData, setPrevBookData] = useState(null);
	const [booksProgress, setBooksProgress] = useState({});
	const [initializedFlag, setInitializedFlag] = useState(false);
	const [resumeFlag, setResumeFlag] = useState(false);
	// eslint-disable-next-line
	const [refreshFlag, setRefreshFlag, refreshFlagRef] = useStateRef(false);
	// eslint-disable-next-line
	const [userInputFlag, setUserInputFlag, userInputFlagRef] =
		useStateRef(false);

	const syncChapterProgress = useCallback(
		(book, chapter, progress, duration) => {
			if (book && chapter) {
				axiosInstance.post(`/user/setChapterProgress`, {
					data: {
						bookId: book.id,
						chapterId: chapter.data.id,
						progress: progress,
						duration: duration,
					},
				});

				setBooksProgress((prevState) => {
					prevState[book.id] = {
						chapterId: chapter.data.id,
						progress: progress,
					};

					return prevState;
				});
			}
		},
		[axiosInstance]
	);

	useEffect(() => {
		// sync when user refreshes or leaves website
		function beforeUnload(e) {
			e.preventDefault();
			e.returnValue = "";

			syncChapterProgress(
				playingBook,
				playingChapter,
				progressRef.current,
				durationRef.current
			);
		}

		window.addEventListener("beforeunload", beforeUnload);

		return () => {
			window.removeEventListener("beforeunload", beforeUnload);
		};
	}, [
		syncChapterProgress,
		playingBook,
		playingChapter,
		sound,
		progressRef,
		durationRef,
	]);

	useEffect(() => {
		if (isLoadingRefresh) {
			setRefreshFlag(true);
			setInitializedFlag(false);
		}
	}, [isLoadingRefresh, setRefreshFlag]);

	useEffectSkipFirst(() => {
		// sync when changing tracks
		if (prevBookData && sound && playingChapter && playingBook)
			syncChapterProgress(
				prevBookData.book,
				prevBookData.chapter,
				progressRef.current,
				durationRef.current
			);

		setPrevBookData({ book: playingBook, chapter: playingChapter });
	}, [playingBook, playingChapter, progressRef, durationRef]);

	useEffectSkipFirst(() => {
		if (sound && resumeFlag) {
			sound.once("play", () => {
				const time = booksProgress[playingBook.id].progress;
				sound.seek(getSeekTimeOnResume(time));
				setResumeFlag(false);
			});
		}

		return () => {
			sound.off("play");
		};
	}, [sound, resumeFlag]);

	useEffectSkipFirst(async () => {
		if (playingChapter) {
			setSound((prevState) => {
				if (prevState) {
					prevState.unload();
					setSoundLoaded(false);
				}

				return new Howl({
					src: [`${serverHostName}/google/stream/${playingChapter.data.id}`],
					html5: true,
					preload: true,
					volume: 0.5,
					rate: rateRef.current,
					onload: function () {
						setDuration(this.duration());
						setSoundLoaded(true);
					},
				});
			});
		}
	}, [
		setDuration,
		setIsPlaying,
		playingChapter,
		setResumeFlag,
		playingBook,
		setInitializedFlag,
		rateRef,
		serverHostName,
	]);

	useEffectSkipFirst(() => {
		if (sound && initializedFlag) {
			setIsPlaying(true);
			setVolume(50);
			setIsMuted(false);
			sound.play();
		}
	}, [
		sound,
		setVolume,
		setIsMuted,
		setProgress,
		setIsPlaying,
		initializedFlag,
		refreshFlagRef,
	]);

	useEffectSkipFirst(() => {
		// handles when root directory is changed
		if (!playingChapter && sound) {
			sound.unload();
			setIsPlaying(false);
			setBooksProgress({});
			setProgress(0);
			setVolume(0);
		}
	}, [playingChapter, sound]);

	useEffect(() => {
		async function getBookProgress() {
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

				const bookId = response.data[0].bookId;
				const chapterId = response.data[0].chapterId;

				const bookChap = getBookAndChapter(bookId, chapterId);

				if (bookChap) {
					const time = reduce[bookId].progress;
					setProgress(getSeekTimeOnResume(time));
					setDuration(reduce[bookId].duration);
					setPlayingChapter(bookChap.chapter);
					setPlayingBook(bookChap.book);
					setCurrentBook(bookChap.book);
				}
			}

			setUserInputFlag(true);
		}

		if (authentication.isAuthenticated && !refreshFlagRef.current)
			getBookProgress();

		setRefreshFlag(false);
	}, [
		axiosInstance,
		getBookAndChapter,
		setPlayingBook,
		setPlayingChapter,
		setCurrentBook,
		setDuration,
		setProgress,
		rootUpdated,
		setUserInputFlag,
		authentication,
		refreshFlagRef,
		setRefreshFlag,
	]);

	useEffect(() => {
		if (userInputFlagRef.current) {
			setInitializedFlag(true);
		}
	}, [playingChapter, userInputFlagRef]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (sound && isPlaying) {
				setProgress(sound.seek());
			}
		}, 250);

		return () => {
			clearInterval(timer);
		};
	}, [setProgress, sound, isPlaying, initializedFlag]);

	function getSeekTimeOnResume(time) {
		return time < 3 ? 0 : Math.floor(time - 3);
	}

	function resumePlayback(bookId) {
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
	}

	function togglePlay() {
		if (sound) {
			if (isPlaying) {
				sound.pause();
				setIsPlaying(false);
			} else {
				sound.play();
				setIsPlaying(true);
			}
		}
	}

	function increaseRate() {
		if (sound) {
			if (rate < 4) {
				setRate(rate + 0.25);
				sound.rate(rate);
			}
		}
	}

	function decreaseRate() {
		if (sound) {
			if (rate > 0.5) {
				setRate(rate - 0.25);
				sound.rate(rate);
			}
		}
	}

	function toggleMute() {
		if (sound) {
			sound.mute(!isMuted);
			setIsMuted(!isMuted);
		}
	}

	function handleSeek(value) {
		if (sound && soundLoaded) {
			setProgress(value);
			sound.seek(value);
		}
	}

	function seekBackward() {
		const newProgress = progress - 5;
		if (newProgress > 0 && sound) {
			sound.seek(newProgress);
			setProgress(sound.seek());
		} else {
			sound.seek(0);
			setProgress(0);
		}
	}

	function seekForward() {
		const newProgress = progress + 5;
		if (newProgress > 0 && sound) {
			sound.seek(newProgress);
			setProgress(sound.seek());
		} else {
			sound.seek(0);
			setProgress(0);
		}
	}

	function previousTrack() {
		if (playingBook) {
			const newIndex = playingChapter.index - 1;
			if (newIndex >= 0)
				setPlayingChapter({
					data: playingBook.chapters[newIndex],
					index: newIndex,
				});
		}
	}

	function nextTrack() {
		if (playingBook) {
			const newIndex = playingChapter.index + 1;
			if (newIndex < playingBook.chapters.length)
				setPlayingChapter({
					data: playingBook.chapters[newIndex],
					index: newIndex,
				});
		}
	}

	function formatTime(seconds) {
		const time = new Date(seconds * 1000).toISOString();
		return seconds < 3600 ? time.substr(14, 5) : time.substr(11, 8);
	}

	const value = {
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
	};

	return (
		<MediaPlayerContext.Provider value={value}>
			{children}
		</MediaPlayerContext.Provider>
	);
};
export const useMediaPlayer = () => useContext(MediaPlayerContext);
