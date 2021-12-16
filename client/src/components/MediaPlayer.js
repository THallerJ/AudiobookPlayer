import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { IconButton, Slider, Typography, Grid, Chip } from "@mui/material";
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
import { useMediaPlayer } from "../contexts/MediaPlayerContext";

const MediaPlayer = () => {
	const theme = useTheme();
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
			<Grid container spacing={theme.spacing(1)}>
				<Grid item xs={4} sm={3}>
					<Typography variant="subtitle2" noWrap>
						{playingBook ? playingBook.name : "No audiobook selected"}
					</Typography>
					<Typography variant="subtitle1" noWrap>
						{playingChapter ? playingChapter.name : "-"}
					</Typography>
				</Grid>
				<Grid item xs={4} sm={5} align="center">
					<IconButton>
						<PreviousIcon />
					</IconButton>
					<IconButton onClick={seekBackward}>
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
						<RemoveIcon fontSize="small" />
					</IconButton>
					<Chip variant="outlined" label={`${rate.toFixed(2)}x`} />
					<IconButton onClick={increaseRate}>
						<AddIcon fontSize="small" />
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
	paddingBottom: theme.spacing(1),

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
