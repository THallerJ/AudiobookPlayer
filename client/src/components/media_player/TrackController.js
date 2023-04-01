import { useEffect, useState } from "react";
import {
	Typography,
	Card,
	CardMedia,
	Box,
	Grid,
	IconButton,
	Slider,
	Chip,
	styled,
} from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseIcon from "@mui/icons-material/PauseCircleOutline";
import NextIcon from "@mui/icons-material/SkipNext";
import PreviousIcon from "@mui/icons-material/SkipPrevious";
import Forward5Icon from "@mui/icons-material/Forward5";
import Replay5Icon from "@mui/icons-material/Replay5";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useDashboard } from "../../contexts/DashboardContext/DashboardContext";
import { useGoogle } from "../../contexts/GoogleContext/GoogleContext";
import { useMediaPlayer } from "../../contexts/MediaPlayerContext/MediaPlayerContext";
import tinyColor from "tinycolor2";
import defaultBookCover from "../../assets/images/defaultBookCover.jpg";

const TrackController = () => {
	const { setShowTrackController } = useDashboard();
	const [brightness, setBrightness] = useState();
	const { playingBook, playingChapter } = useGoogle();
	const [hasCover, setHasCover] = useState();
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
		seekForward,
		previousTrack,
		nextTrack,
	} = useMediaPlayer();

	useEffect(() => {
		setHasCover(playingBook.coverImageUrl ? true : false);

		const brightness1 = tinyColor(playingBook.imageColors[0]).getBrightness();
		const brightness2 = tinyColor(playingBook.imageColors[1]).getBrightness();

		setBrightness([brightness1, brightness2]);
	}, [playingBook]);

	return (
		<Box
			sx={{
				height: "100%",
				background: `linear-gradient(to top, ${playingBook.imageColors[0]}, 50%, ${playingBook.imageColors[1]})`,
				overflow: "hidden",
			}}
		>
			<TrackContollerContainer
				bright={brightness}
				colors={playingBook.imageColors}
				hasCover={hasCover}
			>
				<Grid container>
					<Grid item xs={12} sx={{ display: "flex" }}>
						<Grid item xs={6} align="start">
							<IconButton
								aria-label="Go back"
								onClick={() =>
									setShowTrackController((prevState) => !prevState)
								}
							>
								<ArrowBackIosIcon className="topIcon" />
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
							<IconButton onClick={decreaseRate} aria-label="Decrease rate">
								<RemoveIcon className="topIcon" fontSize="small" />
							</IconButton>
							<Chip
								variant="filled"
								label={`${rate.toFixed(2)}x`}
								sx={{ backgroundColor: "white", color: "black" }}
							/>
							<IconButton onClick={increaseRate} aria-label="Increase rate">
								<AddIcon className="topIcon" fontSize="small" />
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				<Box className="cardWrapper">
					<Card>
						<CardMedia
							component="img"
							image={
								playingBook && playingBook.coverImageUrl
									? playingBook.coverImageUrl
									: defaultBookCover
							}
						/>
					</Card>
				</Box>
				<Grid container justify="center" alignItems="center">
					<Grid className="textColor" item xs={12}>
						<Typography noWrap variant="subtitle1">
							{playingBook.name}
						</Typography>
					</Grid>
					<Grid className="textColor" item>
						<Typography noWrap variant="subtitle1">
							{playingChapter.data.name}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Slider
							max={duration ? duration : 100}
							value={progress}
							onChangeCommitted={(e, v) => handleSeek(v)}
							aria-label="Progress"
						/>
					</Grid>
					<Grid
						item
						container
						xs={12}
						sx={{ display: "flex", justifyContent: "space-between" }}
					>
						<Typography className="textColor" variant="caption">
							{formatTime(progress)}
						</Typography>
						<Typography className="textColor" variant="caption">
							{duration ? formatTime(duration) : "00:00"}
						</Typography>
					</Grid>
					<Grid item xs={12} align="center">
						<IconButton onClick={previousTrack} aria-label="Previous track">
							<PreviousIcon className="bottomIcon" sx={{ fontSize: "35px" }} />
						</IconButton>
						<IconButton
							onClick={seekBackward}
							aria-label="Go back five seconds"
						>
							<Replay5Icon className="bottomIcon" sx={{ fontSize: "35px" }} />
						</IconButton>
						<IconButton onClick={() => togglePlay()} aria-label="Toggle play">
							{isPlaying ? (
								<PauseIcon className="bottomIcon" sx={{ fontSize: "50px" }} />
							) : (
								<PlayIcon className="bottomIcon" sx={{ fontSize: "50px" }} />
							)}
						</IconButton>
						<IconButton
							onClick={seekForward}
							aria-label="Go forward five seconds"
						>
							<Forward5Icon className="bottomIcon" sx={{ fontSize: "35px" }} />
						</IconButton>
						<IconButton onClick={nextTrack} aria-label="Next track">
							<NextIcon className="bottomIcon" sx={{ fontSize: "35px" }} />
						</IconButton>
					</Grid>
				</Grid>
			</TrackContollerContainer>
		</Box>
	);
};

export default TrackController;

// Styled Components
const TrackContollerContainer = styled(Box)(
	({ theme, bright, colors, hasCover }) => ({
		display: "flex",
		height: "100%",
		flexDirection: "column",
		padding: theme.spacing(2),
		alignItems: "center",

		".MuiSlider-root": {
			padding: 0,
			background: hasCover ? colors[0] : "gray",
		},

		".MuiSlider-track, .MuiSlider-thumb": {
			backgroundColor: hasCover ? colors[1] : theme.palette.primary.main,
		},

		".MuiSlider-thumb": {
			height: 0,
			width: 0,
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
			height: "60%",
			width: 225,
			overflow: "hidden",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: theme.spacing(1),
		},

		".bottomIcon": {
			fill: bright && bright[0] > 70 ? theme.palette.grey[900] : "#efefef",
		},

		".topIcon": {
			fill: bright && bright[1] > 70 ? theme.palette.grey[900] : "#efefef",
		},

		".textColor": {
			color: bright && bright[0] > 70 ? "black" : "#efefef",
		},
	})
);
