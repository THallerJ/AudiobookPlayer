import React from "react";
import {
	Typography,
	Card,
	CardMedia,
	Box,
	Grid,
	IconButton,
	Slider,
	Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseIcon from "@mui/icons-material/PauseCircleOutline";
import NextIcon from "@mui/icons-material/SkipNext";
import PreviousIcon from "@mui/icons-material/SkipPrevious";
import Forward5Icon from "@mui/icons-material/Forward5";
import Replay5Icon from "@mui/icons-material/Replay5";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useDashboard } from "../contexts/DashboardContext";
import { useGoogle } from "../contexts/GoogleContext";
import { useMediaPlayer } from "../contexts/MediaPlayerContext";

const TrackInfo = () => {
	const { setShowTrackInfo } = useDashboard();
	const { playingBook } = useGoogle();
	const {
		isPlaying,
		duration,
		togglePlay,
		increaseRate,
		decreaseRate,
		handleSeek,
		formatTime,
		rate,
		progress,
		seekBackward,
	} = useMediaPlayer();

	return (
		<Box
			sx={{
				height: "100%",
				background: `linear-gradient(to top, ${playingBook.imageColors[0]}, 50%, ${playingBook.imageColors[1]})`,
				overflow: "hidden",
			}}
		>
			<TrackInfoContainer>
				<Grid container>
					<Grid item xs={12} sx={{ display: "flex" }}>
						<Grid item xs={6} align="start">
							<IconButton
								onClick={() => setShowTrackInfo((prevState) => !prevState)}
							>
								<ArrowBackIosIcon />
							</IconButton>
						</Grid>
						<Grid
							item
							xs={6}
							align="end"
							sx={{
								justifyContent: "center",
								alignItems: "center",
								flexWrap: "wrap",
							}}
						>
							<IconButton onClick={decreaseRate}>
								<RemoveIcon fontSize="small" />
							</IconButton>
							<Chip
								variant="filled"
								label={`${rate.toFixed(2)}x`}
								sx={{ backgroundColor: "white" }}
							/>
							<IconButton onClick={increaseRate}>
								<AddIcon fontSize="small" />
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				<Box className="cardWrapper">
					<Card>
						<CardMedia
							component="img"
							image={playingBook ? playingBook.coverImageUrl : null}
						/>
					</Card>
				</Box>
				<Grid container justify="center" alignItems="center">
					<Grid item xs={12}>
						<Slider
							max={duration ? duration : 100}
							value={progress}
							onChangeCommitted={(e, v) => handleSeek(v)}
						/>
					</Grid>
					<Grid
						item
						container
						xs={12}
						sx={{ display: "flex", justifyContent: "space-between" }}
					>
						<Typography variant="caption">{formatTime(progress)}</Typography>
						<Typography variant="caption">
							{duration ? formatTime(duration) : "00:00"}
						</Typography>
					</Grid>
					<Grid item xs={12} align="center">
						<IconButton>
							<PreviousIcon sx={{ fontSize: "35px" }} />
						</IconButton>
						<IconButton onClick={seekBackward}>
							<Replay5Icon sx={{ fontSize: "35px" }} />
						</IconButton>
						<IconButton onClick={() => togglePlay()}>
							{isPlaying ? (
								<PauseIcon sx={{ fontSize: "50px" }} />
							) : (
								<PlayIcon sx={{ fontSize: "50px" }} />
							)}
						</IconButton>
						<IconButton>
							<Forward5Icon sx={{ fontSize: "35px" }} />
						</IconButton>
						<IconButton>
							<NextIcon sx={{ fontSize: "35px" }} />
						</IconButton>
					</Grid>
				</Grid>
			</TrackInfoContainer>
		</Box>
	);
};

export default TrackInfo;

// Styled Components
const TrackInfoContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	height: "100%",
	flexDirection: "column",
	padding: theme.spacing(2),
	alignItems: "center",

	".MuiSlider-root": {
		padding: 0,
		background: theme.palette.primary.main,
	},

	".MuiSlider-track": {
		backgroundColor: "white",
	},

	".MuiSlider-thumb": {
		height: 0,
		width: 0,
		backgroundColor: "white",
	},

	".MuiSlider-thumb.Mui-focusVisible, .MuiSlider-thumb:hover, .Mui-active	": {
		boxShadow: "none",
		height: 15,
		width: 15,
	},

	".MuiCardMedia-root": {
		width: 225,
	},

	".cardWrapper": {
		height: "65%",
		width: 225,
		overflow: "hidden",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
}));
