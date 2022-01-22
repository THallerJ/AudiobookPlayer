import React, { useContext, useState, useEffect, useCallback } from "react";
import { useGoogle } from "../contexts/GoogleContext";
import { useApp } from "../contexts/AppContext";
import useEffectSkipFirst from "../hooks/useEffectSkipFirst";
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
	} = useGoogle();
	const { axiosInstance } = useApp();
	const [sound, setSound] = useState();
	const [soundLoaded, setSoundLoaded] = useState(false);
	const [duration, setDuration] = useState();
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [volume, setVolume] = useState(0);
	const [rate, setRate] = useState(1.0);
	const [progress, setProgress] = useState(0);
	const [prevBookData, setPrevBookData] = useState(null);
	const [booksProgress, setBooksProgress] = useState({});
	const [initializedFlag, setInitializedFlag] = useState(false);
	const [resumeFlag, setResumeFlag] = useState(false);
	const [userInputFlag, setUserInputFlag] = useState(false);

	const syncChapterProgress = useCallback(
		(book, chapter, progress, duration) => {
			if (book && chapter) {
				const syncProgress = progress > 4 ? Math.floor(progress - 5) : 0;

				axiosInstance.post(`/player/setChapterProgress`, {
					data: {
						bookId: book.id,
						chapterId: chapter.data.id,
						progress: syncProgress,
						duration: duration,
					},
				});

				setBooksProgress((prevState) => {
					prevState[book.id] = {
						chapterId: chapter.data.id,
						progress: syncProgress,
					};

					return prevState;
				});
			}
		},
		[axiosInstance]
	);

	useEffect(() => {
		function beforeUnload(e) {
			e.preventDefault();
			e.returnValue = "";

			syncChapterProgress(
				playingBook,
				playingChapter,
				sound.seek(),
				sound.duration()
			);
		}

		window.addEventListener("beforeunload", beforeUnload);

		return () => {
			window.removeEventListener("beforeunload", beforeUnload);
		};
	}, [syncChapterProgress, playingBook, playingChapter, sound]);

	useEffectSkipFirst(() => {
		if (prevBookData && sound && playingChapter && playingBook)
			syncChapterProgress(
				prevBookData.book,
				prevBookData.chapter,
				sound.seek(),
				sound.duration()
			);

		setPrevBookData({ book: playingBook, chapter: playingChapter });
	}, [playingBook, playingChapter]);

	useEffectSkipFirst(() => {
		if (sound && resumeFlag) {
			sound.once("play", () => {
				sound.seek(booksProgress[playingBook.id].progress);
				setResumeFlag(false);
			});
		}

		return () => {
			sound.off("play");
		};
	}, [sound, resumeFlag]);

	useEffectSkipFirst(() => {
		if (playingChapter) {
			setSound((prevState) => {
				if (prevState) {
					prevState.unload();
					setSoundLoaded(false);
				}

				return new Howl({
					src: [
						`https://docs.google.com/uc?export=download&id=${playingChapter.data.id}`,
					],
					html5: true,
					preload: true,
					volume: 0.5,
					rate: rate,
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
			const response = await axiosInstance.get(`/player/getBooksProgress`);

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

				setProgress(reduce[bookId].progress);
				setDuration(reduce[bookId].duration);
				setPlayingChapter(bookChap.chapter);
				setPlayingBook(bookChap.book);
				setCurrentBook(bookChap.book);
			}

			setUserInputFlag(true);
		}

		getBookProgress();
	}, [
		axiosInstance,
		getBookAndChapter,
		setPlayingBook,
		setPlayingChapter,
		setCurrentBook,
		rootUpdated,
	]);

	useEffect(() => {
		if (userInputFlag) {
			setInitializedFlag(true);
		}
		// eslint-disable-next-line
	}, [playingChapter]);

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
		setInitializedFlag,
	};

	return (
		<MediaPlayerContext.Provider value={value}>
			{children}
		</MediaPlayerContext.Provider>
	);
};
export const useMediaPlayer = () => useContext(MediaPlayerContext);
