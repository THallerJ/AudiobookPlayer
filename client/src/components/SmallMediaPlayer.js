import React from "react";
import { styled } from "@mui/material/styles";
import { IconButton, Slider, Typography, Grid } from "@mui/material";
import { useGoogle } from "../contexts/GoogleContext";
import { useMediaPlayer } from "../contexts/MediaPlayerContext";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Replay5Icon from "@mui/icons-material/Replay5";

const SmallMediaPlayer = () => {
	const { playingChapter, playingBook } = useGoogle();
	const {
		isPlaying,
		duration,
		sound,
		togglePlay,
		increaseRate,
		decreaseRate,
		toggleMute,
		handleSeek,
		formatTime,
		volume,
		setVolume,
		rate,
		progress,
		seekBackward,
		isMuted,
	} = useMediaPlayer();

	return (
		<StyledMediaPlayerContainer>
			<Grid container>
				<Grid item xs={10}>
					<Typography variant="subtitle2" noWrap>
						{playingBook ? playingBook.name : "No audiobook selected"}
					</Typography>
					<Typography variant="subtitle1" noWrap>
						{playingChapter ? playingChapter.name : "-"}
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<IconButton>
						<PlayIcon fontSize="large" />
					</IconButton>
				</Grid>
			</Grid>
		</StyledMediaPlayerContainer>
	);
};

export default SmallMediaPlayer;

const StyledMediaPlayerContainer = styled("div")(({ theme }) => ({
	paddingRight: theme.spacing(4),
	paddingLeft: theme.spacing(4),
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),

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
