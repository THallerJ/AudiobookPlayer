import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useTheme } from "@mui/material/styles";

const Login = () => {
	const theme = useTheme();

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
					<Button
						onClick={() => {
							window.open(
								`${process.env.REACT_APP_SERVER_URL}/auth/google`,
								"_self"
							);
						}}
						startIcon={<GoogleIcon />}
						variant="contained"
					>
						Login with Google
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Login;
