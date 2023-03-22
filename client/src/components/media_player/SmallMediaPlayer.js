import React, { useState, useEffect } from "react";
import {
	IconButton,
	Typography,
	Grid,
	LinearProgress,
	styled,
} from "@mui/material";
import { useGoogle } from "../../contexts/GoogleContext";
import { useMediaPlayer } from "../../contexts/MediaPlayerContext";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useDashboard } from "../../contexts/DashboardContext";

const SmallMediaPlayer = () => {
	const { playingChapter, playingBook } = useGoogle();
	const { setShowTrackController } = useDashboard();
	const {
		isPlaying,
		duration,
		togglePlay,
		progress,
		initializedFlag,
		resumePlayback,
	} = useMediaPlayer();
	const [progressPercent, setProgressPercent] = useState(0);

	useEffect(() => {
		setProgressPercent((progress / duration) * 100);
	}, [duration, progress, setProgressPercent]);

	return (
		<div>
			<LinearProgress
				variant="determinate"
				value={progressPercent}
				aria-label="Progress"
			/>
			<StyledMediaPlayerContainer
				onClick={() => {
					if (playingBook) setShowTrackController((prevState) => !prevState);
				}}
			>
				<Grid container>
					<Grid item xs={10}>
						<Typography variant="subtitle2" noWrap>
							{playingBook ? playingBook.name : "No Audiobook Selected"}
						</Typography>
						<Typography variant="subtitle1" noWrap>
							{playingChapter ? playingChapter.data.name : ""}
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<IconButton
							aria-label="Toggle play"
							onClick={(e) => {
								initializedFlag ? togglePlay() : resumePlayback();
								e.stopPropagation();
							}}
						>
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

// Styled Components
const StyledMediaPlayerContainer = styled("div")(({ theme }) => ({
	paddingRight: theme.spacing(4),
	paddingLeft: theme.spacing(4),
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
}));
