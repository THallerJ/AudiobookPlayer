import React, { useContext, useState, useEffect, useCallback } from "react";
import { useGoogle } from "../contexts/GoogleContext";
import { useApp } from "../contexts/AppContext";
import useEffectSkipFirst from "../hooks/useEffectSkipFirst";
import { Howl } from "howler";

const MediaPlayerContext = React.createContext();

//TODO FIGURE HOW TO SET INIT

export const MediaPlayerContextProvider = ({ children }) => {
	const {
		setPlayingChapter,
		setCurrentBook,
		setPlayingBook,
		playingChapter,
		playingBook,
		getBookAndChapter,
	} = useGoogle();
	const { axiosInstance } = useApp();
	const [sound, setSound] = useState();
	const [duration, setDuration] = useState();
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [initializedFlag, setInitializedFlag] = useState(false);
	const [volume, setVolume] = useState(0);
	const [rate, setRate] = useState(1.0);
	const [progress, setProgress] = useState(0);
	const [prevBookData, setPrevBookData] = useState(null);
	const [booksProgress, setBooksProgress] = useState({});
	const [resumeFlag, setResumeFlag] = useState(false);

	const syncChapterProgress = useCallback(
		(book, chapter, time) => {
			if (book && chapter) {
				const syncProgress = time > 4 ? Math.floor(time - 5) : 0;

				axiosInstance.post(`/player/setChapterProgress`, {
					data: {
						bookId: book.id,
						chapterId: chapter.data.id,
						progress: syncProgress,
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

			syncChapterProgress(playingBook, playingChapter, sound.seek());
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
				sound.seek()
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
		setInitializedFlag((prevState) => {
			if (sound && prevState) {
				setIsPlaying(true);
				setVolume(50);
				setIsMuted(false);
				setProgress(0); // TODO: CAN I REMOVE?
				sound.play();
			}
		});
	}, [sound, setVolume, setIsMuted, setProgress, setIsPlaying]);

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

	useEffect(() => {
		async function getBookProgress() {
			const response = await axiosInstance.get(`/player/getBooksProgress`);

			const reduce = response.data.reduce((map, obj) => {
				map[obj.bookId] = {
					chapterId: obj.chapterId,
					progress: obj.progress,
				};
				return map;
			}, {});

			setBooksProgress(reduce);

			const bookChap = getBookAndChapter(
				response.data[0].bookId,
				response.data[0].chapterId
			);

			setPlayingChapter(bookChap.chapter);
			setPlayingBook(bookChap.book);
			setCurrentBook(bookChap.book);
		}

		getBookProgress();
	}, [
		axiosInstance,
		getBookAndChapter,
		setPlayingBook,
		setPlayingChapter,
		setCurrentBook,
	]);

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
		if (sound) {
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
