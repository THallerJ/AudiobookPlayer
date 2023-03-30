import { useCallback, useEffect, useState } from "react";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";
import useStateToRef from "../../../hooks/useStateToRef";
import { useApp } from "../../AppContext/AppContext";
import { useDashboard } from "../../DashboardContext/DashboardContext";
import { useGoogle } from "../../GoogleContext/GoogleContext";

const useSyncProgress = ({
	sound,
	isPlaying,
	setIsPlaying,
	progress,
	duration,
}) => {
	const { axiosInstance } = useApp();
	const { anchorEl } = useDashboard();
	const { playingChapter, playingBook } = useGoogle();
	const [prevBookData, setPrevBookData] = useState(null);
	const progressRef = useStateToRef(progress);
	const durationRef = useStateToRef(duration);
	const [booksProgress, setBooksProgress] = useState({});

	const getRewindTime = (time) => {
		return time < 3 ? 0 : Math.floor(time - 3);
	};

	const syncChapterProgress = useCallback(
		(book, chapter, progress, duration, doRewind) => {
			const prog = doRewind ? getRewindTime(progress) : progress;

			if (book && chapter) {
				axiosInstance.post(`/user/setChapterProgress`, {
					data: {
						bookId: book.id,
						chapterId: chapter.data.id,
						progress: prog,
						duration: duration,
					},
				});

				setBooksProgress((prevState) => {
					prevState[book.id] = {
						chapterId: chapter.data.id,
						progress: prog,
					};

					return prevState;
				});
			}
		},
		[axiosInstance]
	);

	// sync when user refreshes or leaves website
	useEffect(() => {
		const beforeUnload = (e) => {
			e.preventDefault();
			e.returnValue = "";

			syncChapterProgress(
				playingBook,
				playingChapter,
				progressRef.current,
				durationRef.current,
				true
			);
		};

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

	// sync when changing tracks
	useEffectSkipFirst(() => {
		if (prevBookData && sound && playingChapter && playingBook) {
			syncChapterProgress(
				prevBookData.book,
				prevBookData.chapter,
				progressRef.current,
				durationRef.current,
				true
			);
		}

		setPrevBookData({ book: playingBook, chapter: playingChapter });
	}, [playingBook, playingChapter, progressRef, durationRef]);

	// sync when opening menu
	useEffectSkipFirst(() => {
		if (Boolean(anchorEl) && sound) {
			if (isPlaying) {
				sound.pause();
				setIsPlaying(false);
			}
			syncChapterProgress(
				playingBook,
				playingChapter,
				progressRef.current,
				durationRef.current,
				false
			);
		}
	}, [anchorEl]);

	// reset book progress when root directory is changed
	useEffectSkipFirst(() => {
		if (!playingChapter && sound) {
			setBooksProgress({});
		}
	}, [playingChapter, sound]);

	return { booksProgress, setBooksProgress };
};

export default useSyncProgress;
