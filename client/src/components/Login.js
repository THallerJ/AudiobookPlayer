import React from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
	return (
		<div>
			<Button
				onClick={() => {
					window.open("http://localhost:5000/auth/google", "_self");
				}}
				startIcon={<GoogleIcon />}
				variant="contained"
			>
				Login with Google
			</Button>
		</div>
	);
};

export default Login;
