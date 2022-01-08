import React from "react";
import { Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDashboard } from "../contexts/DashboardContext";

const EmptyLibrary = () => {
	const { setOpenRootDialog } = useDashboard();

	return (
		<StyledContainer>
			<Typography>
				You must select where your where your audiobook library is located on
				Google Drive.
			</Typography>
			<Box className="btnContainer">
				<Button onClick={() => setOpenRootDialog(true)}>
					Set Drive Directory
				</Button>
				<Button>Tutorial</Button>
			</Box>
		</StyledContainer>
	);
};

export default EmptyLibrary;

// Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
	height: "60vh",
	padding: theme.spacing(3),
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",

	".btnContainer": {
		display: "flex",
		paddingTop: theme.spacing(2),
	},
}));
