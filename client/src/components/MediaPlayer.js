import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { IconButton, Slider, Typography, Grid } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseIcon from "@mui/icons-material/PauseCircleOutline";
import NextIcon from "@mui/icons-material/SkipNext";
import PreviousIcon from "@mui/icons-material/SkipPrevious";
import ArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TimeIcon from "@mui/icons-material/AccessTime";
import VolumeIcon from "@mui/icons-material/VolumeUp";
import { useGoogle } from "../contexts/GoogleContext";
import { Howl } from "howler";

const MediaPlayer = () => {
	const theme = useTheme();
	const { playingChapter, playingBook } = useGoogle();
	const [sound, setSound] = useState();
	const [duration, setDuration] = useState();
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (playingChapter) {
			var howl = new Howl({
				src: [
					`https://docs.google.com/uc?export=download&id=${playingChapter.id}`,
				],
				html5: true,
				preload: true,
				onload: function () {
					setDuration(this.duration());
				},
			});

			howl.play();
			setIsPlaying(true);

			setSound((prevState) => {
				if (prevState) {
					prevState.unload();
				}

				return howl;
			});
		}
	}, [setSound, playingChapter, setDuration, setIsPlaying]);

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
						<PreviousIcon fontSize="small" />
					</IconButton>
					<IconButton>
						<ArrowLeftIcon fontSize="small" />
					</IconButton>
					<IconButton onClick={() => togglePlay()}>
						{isPlaying ? (
							<PauseIcon fontSize="large" />
						) : (
							<PlayIcon fontSize="large" />
						)}
					</IconButton>
					<IconButton>
						<ArrowRightIcon fontSize="small" />
					</IconButton>
					<IconButton>
						<NextIcon fontSize="small" />
					</IconButton>
				</Grid>
				<Grid container item xs={4} justifyContent="flex-end">
					<IconButton>
						<TimeIcon />
					</IconButton>
				</Grid>
				<Grid item xs={10} sx={{ display: "flex", flexDirection: "row" }}>
					<Typography variant="caption" sx={{ pr: theme.spacing(1) }}>
						00:00
					</Typography>
					<Slider size="small" sx={{ width: "90%" }} />
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
					<VolumeIcon fontSize="small" sx={{ pr: theme.spacing(1) }} />
					<Slider size="small" />
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

	".MuiSlider-thumb.Mui-focusVisible, .MuiSlider-thumb:hover": {
		boxShadow: "none",
		height: 15,
		width: 15,
	},
}));
