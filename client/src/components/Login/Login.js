import React from "react";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useApp } from "../../contexts/AppContext";
import GoogleButton from "react-google-button";

const Login = () => {
	const theme = useTheme();
	const { serverUrl } = useApp();

	return (
		<Grid
			container
			justifyContent="center"
			alignItems="center"
			sx={{ minHeight: "100vh" }}
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
					<Typography align="center" variant="h3">
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
			</Grid>
		</Grid>
	);
};

export default Login;
