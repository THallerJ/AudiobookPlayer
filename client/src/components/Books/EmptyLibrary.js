import React, { useState } from "react";
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDashboard } from "../../contexts/DashboardContext";
import { useApp } from "../../contexts/AppContext";
import { useGoogle } from "../../contexts/GoogleContext";
import TutorialDialog from "../Dialogs/TutorialDialog";

const EmptyLibrary = () => {
	const { googleDirectoryExists } = useApp();
	const { setOpenRootDialog, isFolderSelected } = useDashboard();
	const [openTutorialDialog, setOpenTutorialDialog] = useState(false);
	const { isLoadingLibrary } = useGoogle();

	function renderBody() {
		if (isLoadingLibrary || isFolderSelected) {
			return (
				<Box className="centerProgress">
					<CircularProgress />
				</Box>
			);
		} else {
			return (
				<div>
					{googleDirectoryExists ? (
						<Typography>
							Your library either doesn't have any books, or your library is not
							organized properly.
						</Typography>
					) : (
						<Typography>
							You must select where your where your audiobook library is located
							on Google Drive.
						</Typography>
					)}
					<Box className="btnContainer">
						<Button onClick={() => setOpenRootDialog(true)}>
							Set Drive Directory
						</Button>
						<Button onClick={() => setOpenTutorialDialog(true)}>
							Tutorial
						</Button>
					</Box>
					<TutorialDialog
						open={openTutorialDialog}
						setOpen={setOpenTutorialDialog}
					/>
				</div>
			);
		}
	}
	return (
		<StyledContainer>
			<Box className="body">{renderBody()}</Box>
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

	".body": {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},

	".btnContainer": {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: theme.spacing(1),
	},

	".centerProgress": {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "90%",
	},
}));
