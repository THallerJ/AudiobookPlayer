import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { IconButton, Typography, Grid, LinearProgress } from "@mui/material";
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
	const [progressPercent, setProgressPercent] = useState(0);

	useEffect(() => {
		setProgressPercent((progress / duration) * 100);
	}, [duration, progress, setProgressPercent]);

	return (
		<div>
			<LinearProgress variant="determinate" value={progressPercent} />
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
						<IconButton onClick={togglePlay}>
							{isPlaying ? (
								<PauseIcon fontSize="large" />
							) : (
								<PlayIcon fontSize="large" />
							)}
						</IconButton>
					</Grid>
				</Grid>
			</StyledMediaPlayerContainer>
		</div>
	);
};

export default SmallMediaPlayer;

const StyledMediaPlayerContainer = styled("div")(({ theme }) => ({
	paddingRight: theme.spacing(4),
	paddingLeft: theme.spacing(4),
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
}));
