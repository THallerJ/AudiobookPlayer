import React from "react";
import { Grid, Typography, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useApp } from "../../contexts/AppContext";
import GoogleButton from "react-google-button";
import { useHistory } from "react-router-dom";

const Login = () => {
	const theme = useTheme();
	const history = useHistory();

	const { serverUrl } = useApp();

	return (
		<Grid
			container
			justifyContent="center"
			alignItems="center"
			sx={{ minHeight: "100vh", p: theme.spacing(2) }}
		>
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
						variant={useMediaQuery(theme.breakpoints.up("sm")) ? "h3" : "h4"}
						sx={{ pb: theme.spacing(4) }}
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
					<Button
						aria-label="App Information"
						onClick={() => {
							history.push("/about");
						}}
					>
						App Information
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Login;
