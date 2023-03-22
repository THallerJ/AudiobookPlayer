import React, { useState, Suspense } from "react";
import {
	Typography,
	Button,
	Box,
	CircularProgress,
	styled,
} from "@mui/material";
import { useDashboard } from "../../contexts/DashboardContext";
import { useGoogle } from "../../contexts/GoogleContext";
import { useApp } from "../../contexts/AppContext";
import CenterWrapper from "../styled_components/CenterWrapper";

const TutorialDialog = React.lazy(() => import("../dialogs/TutorialDialog"));

const EmptyLibrary = () => {
	const { googleDirectoryExists } = useApp();
	const { setOpenFolderDialog } = useDashboard();
	const { isLoadingLibrary } = useGoogle();
	const [openTutorialDialog, setOpenTutorialDialog] = useState(false);

	const renderBody = () => {
		if (isLoadingLibrary) {
			return (
				<CenterWrapper>
					<CircularProgress />
				</CenterWrapper>
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
						<Typography align="center">
							You must select where your where your audiobook library is located
							on Google Drive.
						</Typography>
					)}
					<Box className="btnContainer">
						<Button
							onClick={() => setOpenFolderDialog(true)}
							aria-label="Set drive directory"
						>
							Set Drive Directory
						</Button>
						<Button
							onClick={() => setOpenTutorialDialog(true)}
							aria-label="Tutorial"
						>
							Tutorial
						</Button>
					</Box>
					<Suspense fallback={null}>
						<TutorialDialog
							open={openTutorialDialog}
							setOpen={setOpenTutorialDialog}
						/>
					</Suspense>
				</div>
			);
		}
	};
	return (
		<StyledContainer>
			<CenterWrapper>{renderBody()}</CenterWrapper>
		</StyledContainer>
	);
};

export default EmptyLibrary;

// Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
	height: "60vh",
	padding: theme.spacing(4),
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",

	".btnContainer": {
		display: "flex",
		justifyContent: "center",
		paddingTop: theme.spacing(1),
	},
}));
