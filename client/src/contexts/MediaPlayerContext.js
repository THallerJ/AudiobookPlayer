import React, { useContext, useState, useEffect, useCallback } from "react";
import { useGoogle } from "../contexts/GoogleContext";
import { useApp } from "../contexts/AppContext";
import useEffectSkipFirst from "../hooks/useEffectSkipFirst";
import { Howl } from "howler";

const MediaPlayerContext = React.createContext();

export const MediaPlayerContextProvider = ({ children }) => {
	const { setPlayingChapter, playingChapter, playingBook } = useGoogle();
	const { axiosInstance } = useApp();
	const [sound, setSound] = useState();
	const [duration, setDuration] = useState();
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [volume, setVolume] = useState(0);
	const [rate, setRate] = useState(1.0);
	const [progress, setProgress] = useState(0);
	const [prevBookData, setPrevBookData] = useState(null);
	const [booksProgress, setBooksProgress] = useState();

	const syncChapterProgress = useCallback(
		(book, chapter, time) => {
			if (book && chapter) {
				axiosInstance.post(`/player/setChapterProgress`, {
					data: {
						bookId: book.id,
						chapterId: chapter.data.id,
						time: Math.floor(time),
					},
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
		setVolume(50);
		setIsMuted(false);
		setProgress(0);

		if (sound) {
			setIsPlaying(true);
			sound.play();
		}
	}, [sound, setVolume, setIsMuted, setProgress, setIsPlaying]);

	useEffectSkipFirst(() => {
		if (prevBookData)
			syncChapterProgress(
				prevBookData.book,
				prevBookData.chapter,
				sound.seek()
			);
		setPrevBookData({ book: playingBook, chapter: playingChapter });
	}, [playingBook, playingChapter]);

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
	}, [prevBookData, setDuration, setIsPlaying]);

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
	}, [setSound, playingChapter, setDuration, setIsPlaying]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (sound && isPlaying) {
				setProgress(sound.seek());
			}
		}, 250);

		return () => {
			clearInterval(timer);
		};
	}, [setProgress, sound, isPlaying]);

	const getBookProgress = useCallback(async () => {
		const response = await axiosInstance.get(`/player/getBooksProgress`);
		return response.data;
	}, [axiosInstance]);

	useEffect(() => {
		async function fetchBookProgress() {
			const result = await getBookProgress();
			setBooksProgress(result);
		}

		fetchBookProgress();
	}, [getBookProgress]);

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
	};

	return (
		<MediaPlayerContext.Provider value={value}>
			{children}
		</MediaPlayerContext.Provider>
	);
};
export const useMediaPlayer = () => useContext(MediaPlayerContext);
