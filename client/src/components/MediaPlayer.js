import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { IconButton, Slider, Typography, Grid } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseIcon from "@mui/icons-material/Pause";
import NextIcon from "@mui/icons-material/SkipNext";
import PreviousIcon from "@mui/icons-material/SkipPrevious";
import ArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TimeIcon from "@mui/icons-material/AccessTime";
import VolumeIcon from "@mui/icons-material/VolumeUp";

const MediaPlayer = () => {
	const theme = useTheme();

	return (
		<StyledMediaPlayerContainer>
			<Grid container spacing={theme.spacing(1)}>
				<Grid item xs={4}>
					<Typography variant="subtitle2">Book Title</Typography>
					<Typography variant="subtitle1">Chapter 1</Typography>
				</Grid>
				<Grid item xs={4} align="center">
					<IconButton>
						<PreviousIcon fontSize="small" />
					</IconButton>
					<IconButton>
						<ArrowLeftIcon fontSize="small" />
					</IconButton>
					<IconButton>
						<PlayIcon fontSize="large" />
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
						00:00
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
