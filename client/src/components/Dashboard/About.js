import React from "react";
import {
	Typography,
	IconButton,
	AppBar,
	Toolbar,
	Box,
	useMediaQuery,
	List,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled, useTheme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import Div100vh from "react-div-100vh";
import LabelListItem from "../misc/LabelListItem";

const About = () => {
	const history = useHistory();
	const theme = useTheme();

	function handleBackButton() {
		history.push("/");
	}

	const content = (
		<div>
			<Typography variant="h5">About</Typography>

			<Typography variant="body1">
				Stream Audiobook Player is a web app that allows users to stream
				audiobooks that are stored on their Google Drive.
			</Typography>

			<Typography variant="h5">Features</Typography>

			<List>
				<LabelListItem text="Adjustable playback speed (0.5x to 4x speed)" />
				<LabelListItem text="Light/dark mode" />
				<LabelListItem text="Progress syncs across devices" />
				<LabelListItem text="Book covers are automatically found and displayed" />
				<LabelListItem text="Mobile and desktop friendly UI (built with Material UI)" />
				<LabelListItem text="Supports MP3, MPEG, OPUS, OGG, OGA, WAV, AAC, CAF, M4A, MP4, WEBA, WEBM, DOLBY, and FLAC file types." />
			</List>

			<Typography variant="h5">Privay Policy</Typography>

			<Typography variant="body1">[Insert Privacy Policy]</Typography>
		</div>
	);

	const toolbar = (
		<AppBar color="inherit" position="fixed">
			<Toolbar>
				<IconButton
					color="inherit"
					edge="start"
					aria-label="Toggle drawer"
					onClick={handleBackButton}
				>
					<ArrowBackIcon />
				</IconButton>
				<Typography noWrap variant="h6">
					About Stream Audiobook Player
				</Typography>
			</Toolbar>
		</AppBar>
	);
	return (
		<Div100vh>
			<StyledAboutContainer>
				{toolbar}
				<Box className="body">
					<Box
						className="container"
						sx={{
							width: useMediaQuery(theme.breakpoints.up("md")) ? "55%" : "100%",
						}}
					>
						{content}
					</Box>
				</Box>
			</StyledAboutContainer>
		</Div100vh>
	);
};

export default About;

// Styled Components
const StyledAboutContainer = styled("div")(({ theme }) => ({
	display: "flex",
	height: "100%",
	width: "100%",

	".body": {
		paddingTop: theme.mixins.toolbar.minHeight,
		width: "100%",
		height: "100%",
		backgroundColor: theme.palette.background.alt,
		display: "flex",
		justifyContent: "center",
	},

	".container": {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(6),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(5),
		height: "100%",
		backgroundColor: theme.palette.background.container,
		overflow: "auto",
	},

	".MuiTypography-h5": {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(1),
	},
}));
