import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { IconButton, Slider, Typography, Grid } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseIcon from "@mui/icons-material/PauseCircleOutline";
import NextIcon from "@mui/icons-material/SkipNext";
import PreviousIcon from "@mui/icons-material/SkipPrevious";
import Forward5Icon from "@mui/icons-material/Forward5";
import Replay5Icon from "@mui/icons-material/Replay5";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import VolumeIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { useGoogle } from "../contexts/GoogleContext";
import { Howl } from "howler";
import useEffectSkipFirst from "../hooks/useEffectSkipFirst";

const MediaPlayer = () => {
	const theme = useTheme();
	const { playingChapter, playingBook } = useGoogle();
	const [sound, setSound] = useState();
	const [duration, setDuration] = useState();
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [volume, setVolume] = useState(0);
	const [rate, setRate] = useState(1.0);
	const [progress, setProgress] = useState(0);

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
		if (playingChapter) {
			setSound((prevState) => {
				if (prevState) {
					prevState.unload();
				}

				return new Howl({
					src: [
						`https://docs.google.com/uc?export=download&id=${playingChapter.id}`,
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
			if (value < progress) {
				setProgress(value);
				sound.seek(value);
			}
		}
	}

	function formatTime(seconds) {
		const time = new Date(seconds * 1000).toISOString();
		return seconds < 3600 ? time.substr(14, 5) : time.substr(11, 8);
	}

	return (
		<StyledMediaPlayerContainer>
			<Grid container spacing={theme.spacing(1)}>
				<Grid item xs={4}>
					<Typography variant="subtitle2">
						{playingBook ? playingBook.name : "No audiobook selected"}
					</Typography>
					<Typography variant="subtitle1">
						{playingChapter ? playingChapter.name : "-"}
					</Typography>
				</Grid>
				<Grid item xs={4} align="center">
					<IconButton>
						<PreviousIcon />
					</IconButton>
					<IconButton
						onClick={() => {
							if (progress - 5 > 0 && sound) {
								sound.seek(progress - 5);
								setProgress(sound.seek());
							} else {
								sound.seek(0);
								setProgress(0);
							}
						}}
					>
						<Replay5Icon />
					</IconButton>
					<IconButton onClick={() => togglePlay()}>
						{isPlaying ? (
							<PauseIcon fontSize="large" />
						) : (
							<PlayIcon fontSize="large" />
						)}
					</IconButton>
					<IconButton>
						<Forward5Icon />
					</IconButton>
					<IconButton>
						<NextIcon />
					</IconButton>
				</Grid>
				<Grid
					container
					item
					xs={4}
					justifyContent="flex-end"
					sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
				>
					<IconButton onClick={decreaseRate}>
						<RemoveIcon />
					</IconButton>
					<Typography variant="h6">{rate.toFixed(2)}x</Typography>
					<IconButton onClick={increaseRate}>
						<AddIcon />
					</IconButton>
				</Grid>
				<Grid item xs={10} sx={{ display: "flex", flexDirection: "row" }}>
					<Typography variant="caption" sx={{ pr: theme.spacing(1) }}>
						{formatTime(progress)}
					</Typography>
					<Slider
						size="small"
						sx={{ width: "90%" }}
						max={duration ? duration : 100}
						value={progress}
						onChangeCommitted={(e, v) => handleSeek(v)}
					/>
					<Typography
						variant="caption"
						sx={{ pl: theme.spacing(1), verticalAlign: "bottom" }}
					>
						{duration ? formatTime(duration) : "00:00"}
					</Typography>
				</Grid>
				<Grid
					item
					xs={2}
					align="center"
					sx={{ display: "flex", flexDirection: "row" }}
				>
					<IconButton
						onClick={() => toggleMute()}
						sx={{ pr: theme.spacing(1), pt: theme.spacing(0) }}
					>
						{isMuted ? (
							<VolumeOffIcon fontSize="small" />
						) : (
							<VolumeIcon fontSize="small" />
						)}
					</IconButton>
					<Slider
						onChange={(e, v) => {
							setVolume(v);
							sound.volume(v / 100);
						}}
						disabled={sound ? false : true}
						size="small"
						valueLabelDisplay="auto"
						value={volume}
					/>
				</Grid>
			</Grid>
		</StyledMediaPlayerContainer>
	);
};

export default MediaPlayer;

// Styled Components
const StyledMediaPlayerContainer = styled("div")(({ theme }) => ({
	paddingRight: theme.spacing(4),
	paddingLeft: theme.spacing(4),
	paddingTop: theme.spacing(2),

	" .MuiSlider-thumb": {
		height: 0,
		width: 0,
	},

	".MuiSlider-thumb.Mui-focusVisible, .MuiSlider-thumb:hover, .Mui-active	": {
		boxShadow: "none",
		height: 15,
		width: 15,
	},
}));
