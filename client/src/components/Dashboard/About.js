import React from "react";
import {
	Typography,
	IconButton,
	AppBar,
	Toolbar,
	Box,
	useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled, useTheme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import Div100vh from "react-div-100vh";

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
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
				velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
				occaecat cupidatat non proident, sunt in culpa qui officia deserunt
				mollit anim id est laborum.
			</Typography>
			<Typography variant="h5">Privacy Policy</Typography>
			<Typography variant="body1">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Arcu bibendum at
				varius vel pharetra vel. Ullamcorper velit sed ullamcorper morbi
				tincidunt. Ac ut consequat semper viverra nam libero. Aliquam nulla
				facilisi cras fermentum odio eu feugiat pretium. Netus et malesuada
				fames ac turpis egestas maecenas. Cras semper auctor neque vitae tempus
				quam pellentesque nec nam. Ornare arcu odio ut sem nulla. At risus
				viverra adipiscing at in. Aliquet nec ullamcorper sit amet. Nec sagittis
				aliquam malesuada bibendum arcu vitae.
			</Typography>
			<Typography variant="body1">
				Semper risus in hendrerit gravida rutrum quisque non tellus orci.
				Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt.
				Donec ac odio tempor orci dapibus ultrices in. In aliquam sem fringilla
				ut morbi tincidunt. In nisl nisi scelerisque eu ultrices vitae auctor
				eu. Non pulvinar neque laoreet suspendisse interdum consectetur libero
				id. Risus viverra adipiscing at in tellus integer feugiat. Egestas sed
				tempus urna et. Purus non enim praesent elementum. Euismod nisi porta
				lorem mollis aliquam ut porttitor leo a. Egestas maecenas pharetra
				convallis posuere morbi leo urna molestie. Augue mauris augue neque
				gravida in fermentum. Enim ut sem viverra aliquet eget sit amet tellus
				cras. Facilisi etiam dignissim diam quis enim lobortis scelerisque
				fermentum. Lacus sed turpis tincidunt id aliquet risus feugiat. Metus
				vulputate eu scelerisque felis imperdiet. Tincidunt dui ut ornare lectus
				sit amet est placerat. In dictum non consectetur a erat nam. Sed blandit
				libero volutpat sed cras.
			</Typography>
			<Typography variant="body1">
				Semper risus in hendrerit gravida rutrum quisque non tellus orci.
				Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt.
				Donec ac odio tempor orci dapibus ultrices in. In aliquam sem fringilla
				ut morbi tincidunt. In nisl nisi scelerisque eu ultrices vitae auctor
				eu. Non pulvinar neque laoreet suspendisse interdum consectetur libero
				id. Risus viverra adipiscing at in tellus integer feugiat. Egestas sed
				tempus urna et. Purus non enim praesent elementum. Euismod nisi porta
				lorem mollis aliquam ut porttitor leo a. Egestas maecenas pharetra
				convallis posuere morbi leo urna molestie. Augue mauris augue neque
				gravida in fermentum. Enim ut sem viverra aliquet eget sit amet tellus
				cras. Facilisi etiam dignissim diam quis enim lobortis scelerisque
				fermentum. Lacus sed turpis tincidunt id aliquet risus feugiat. Metus
				vulputate eu scelerisque felis imperdiet. Tincidunt dui ut ornare lectus
				sit amet est placerat. In dictum non consectetur a erat nam. Sed blandit
				libero volutpat sed cras.
			</Typography>
			<Typography variant="body1">
				Ut faucibus pulvinar elementum integer enim neque. Amet consectetur
				adipiscing elit ut aliquam purus sit amet. Etiam dignissim diam quis
				enim. Eget nunc lobortis mattis aliquam faucibus purus in massa.
				Elementum pulvinar etiam non quam lacus suspendisse. Urna et pharetra
				pharetra massa massa ultricies. Velit sed ullamcorper morbi tincidunt.
				Interdum velit laoreet id donec ultrices tincidunt arcu. Fringilla urna
				porttitor rhoncus dolor. Quisque non tellus orci ac. Praesent tristique
				magna sit amet purus gravida. Enim facilisis gravida neque convallis a.
				Sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula.
				Pellentesque eu tincidunt tortor aliquam. Vitae auctor eu augue ut
				lectus arcu bibendum. Dignissim suspendisse in est ante. Mauris sit amet
				massa vitae tortor condimentum lacinia. Dignissim suspendisse in est
				ante. Mauris sit amet massa vitae tortor condimentum lacinia.
			</Typography>
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
