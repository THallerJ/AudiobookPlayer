import React from "react";
import { Typography, IconButton, AppBar, Toolbar, styled } from "@mui/material";
import Div100vh from "react-div-100vh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const BackToolBar = ({ title, content }) => {
	const navigate = useNavigate();

	const handleBackButton = () => {
		navigate("/");
	};

	const toolbar = (
		<AppBar position="fixed">
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
					{title}
				</Typography>
			</Toolbar>
		</AppBar>
	);

	return (
		<Div100vh>
			{toolbar}
			<StyledBackToolBar>
				<div className="body">{content}</div>
			</StyledBackToolBar>
		</Div100vh>
	);
};

export default BackToolBar;

// Styled Components
const StyledBackToolBar = styled("div")(({ theme }) => ({
	height: "100%",
	width: "100%",

	".body": { paddingTop: theme.mixins.toolbar.minHeight },
}));
