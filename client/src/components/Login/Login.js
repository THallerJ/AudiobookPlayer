import React, { useEffect } from "react";
import {
	Grid,
	Typography,
	Button,
	useMediaQuery,
	Link,
	Box,
	useTheme,
} from "@mui/material";
import { useApp } from "../../contexts/AppContext/AppContext";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/images/backgroundImage.jpg";

const Login = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { serverUrl, darkModeEnabled, toggleDarkMode, authentication } =
		useApp();
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));

	useEffect(() => {
		if (darkModeEnabled === "true") toggleDarkMode();
	}, [authentication]);

	return (
		<Box
			sx={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-evenly",
				alignItems: "center",
				minHeight: "100vh",
			}}
		>
			<Grid container justifyContent="center" alignItems="center">
				<Grid
					container
					item
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					spacing={theme.spacing(2)}
				>
					<Grid item>
						<Typography
							align="center"
							variant={isLargeScreen ? "h3" : "h4"}
							sx={{
								pb: theme.spacing(4),
								pr: theme.spacing(1),
								pl: theme.spacing(1),
							}}
						>
							Stream Audiobook Player
						</Typography>
					</Grid>
					<Grid item>
						<GoogleButton
							onClick={async () => {
								window.open(`${serverUrl}/auth/google`, "_self");
							}}
							aria-label="Sign in with Google"
						/>
					</Grid>
					<Grid item>
						<Button
							aria-label="App Information"
							onClick={() => {
								navigate("/appinfo");
							}}
						>
							App Information
						</Button>
						<Button
							aria-label="Privacy Policy"
							onClick={() => {
								navigate("/privacypolicy");
							}}
						>
							Privacy Policy
						</Button>
					</Grid>
				</Grid>
			</Grid>
			<Typography
				sx={{
					mt: theme.spacing(8),
					pb: theme.spacing(1),
				}}
				variant="caption"
			>
				<Link
					underline="hover"
					href="https://www.freepik.com/free-vector/gradient-white-monochrome-background_15273829.htm#page=5&query=background%20white&position=19&from_view=search&track=sph"
				>
					Image
				</Link>
				{" by Freepik"}
			</Typography>
		</Box>
	);
};

export default Login;
