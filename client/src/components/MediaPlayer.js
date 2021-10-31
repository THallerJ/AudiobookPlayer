import React from "react";
import Card from "@mui/material/Card";
import { styled, useTheme } from "@mui/material/styles";
import { IconButton, Slider, Typography } from "@mui/material";
import { Box } from "@mui/system";
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
			<Card raised={true}>
				<Box
					sx={{ display: "flex", flexDirection: "row", pl: theme.spacing(3) }}
				>
					<Box sx={{ flexGrow: 2, pt: theme.spacing(2) }}>
						<Typography variant="subtitle2">Book Title</Typography>
						<Typography variant="subtitle1">Chapter 1</Typography>
					</Box>
					<Box sx={{ flexGrow: 2, pt: theme.spacing(2) }}>
						<IconButton>
							<PreviousIcon />
						</IconButton>
						<IconButton>
							<ArrowLeftIcon />
						</IconButton>
						<IconButton>
							<PlayIcon fontSize="large" />
						</IconButton>
						<IconButton>
							<ArrowRightIcon />
						</IconButton>
						<IconButton>
							<NextIcon />
						</IconButton>
					</Box>
					<Box sx={{ flexGrow: 1, pt: theme.spacing(2) }}>
						<IconButton>
							<TimeIcon />
						</IconButton>
					</Box>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						pl: theme.spacing(3),
						pb: theme.spacing(1),
						pt: theme.spacing(1),
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							flexGrow: 3,
						}}
					>
						<Typography
							variant="subtitle2"
							sx={{ paddingRight: theme.spacing(2) }}
						>
							00:00
						</Typography>
						<Slider size="small" sx={{ width: "90%" }} />
						<Typography variant="subtitle2" sx={{ pl: theme.spacing(2) }}>
							00:00
						</Typography>
					</Box>
					<Box sx={{ flexGrow: 1 }}>
						<VolumeIcon sx={{ pr: theme.spacing(1), verticalAlign: "top" }} />
						<Slider size="small" sx={{ width: "25%" }} />
					</Box>
				</Box>
			</Card>
		</StyledMediaPlayerContainer>
	);
};

export default MediaPlayer;

// Styled Components
const StyledMediaPlayerContainer = styled("div")(({ theme }) => ({
	width: "100%",

	".MuiIconButton-root": {
		margin: theme.spacing(0),
	},

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
