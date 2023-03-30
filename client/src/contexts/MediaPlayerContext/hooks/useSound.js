import { useState, useEffect } from "react";
import { Howl } from "howler";
import { useGoogle } from "../../GoogleContext/GoogleContext";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";
import useStateRef from "../../../hooks/useStateRef";
import { useApp } from "../../AppContext/AppContext";

const useSound = ({ userInputFlagRef, refreshFlagRef }) => {
	const [initializedFlag, setInitializedFlag] = useState(false);
	const { serverUrl } = useApp();
	const { playingChapter, playingBook } = useGoogle();
	const [sound, setSound] = useState();
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [volume, setVolume] = useState(0);
	const [rate, setRate, rateRef] = useStateRef(1.0);
	const [duration, setDuration] = useState();
	const [progress, setProgress] = useState(0);
	const [soundLoaded, setSoundLoaded] = useState(false);

	useEffectSkipFirst(async () => {
		if (playingChapter) {
			setSound((prevState) => {
				if (prevState) {
					prevState.unload();
					setSoundLoaded(false);
				}

				return new Howl({
					src: [`${serverUrl}/google/stream/${playingChapter.data.id}`],
					html5: true,
					format: [".mp3", ".m4a", ".aac", ".ogg"],
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
	}, [playingChapter, playingBook, rateRef, serverUrl]);

	useEffect(() => {
		if (userInputFlagRef.current) {
			setInitializedFlag(true);
		}
	}, [playingChapter, userInputFlagRef]);

	useEffectSkipFirst(() => {
		if (sound && initializedFlag) {
			setIsPlaying(true);
			setVolume(50);
			setIsMuted(false);
			sound.play();
		}
	}, [sound, initializedFlag, refreshFlagRef]);

	// update progress as audio file is playing
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

	// handles when root directory is changed
	useEffectSkipFirst(() => {
		if (!playingChapter && sound) {
			sound.unload();
			setIsPlaying(false);
			setProgress(0);
			setVolume(0);
		}
	}, [playingChapter, sound]);

	return {
		sound,
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
		initializedFlag,
		setInitializedFlag,
	};
};

export default useSound;
