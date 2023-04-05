import { useState, Suspense, lazy } from "react";
import {
	Box,
	Typography,
	Hidden,
	IconButton,
	AppBar,
	Toolbar,
	Menu,
	MenuItem,
	LinearProgress,
	styled,
	useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Body from "./Body";
import { useDashboard } from "../../contexts/DashboardContext/DashboardContext";
import { useApp } from "../../contexts/AppContext/AppContext";
import MoreVert from "@mui/icons-material/MoreVert";
import { useGoogle } from "../../contexts/GoogleContext/GoogleContext";
import Div100vh from "react-div-100vh";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import useIsLargeScreen from "../../hooks/useIsLargeScreen";

const FolderSelectDialog = lazy(() => import("../dialogs/FolderSelectDialog"));
const ChangeCoverDialog = lazy(() => import("../dialogs/ChangeCoverDialog"));

const Dashboard = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [openCoverDialog, setOpenCoverDialog] = useState(false);
	const {
		setOpenDrawer,
		anchorEl,
		setAnchorEl,
		openFolderDialog,
		setOpenFolderDialog,
		showTrackController,
	} = useDashboard();
	const { toggleDarkMode } = useApp();
	const { refreshLibrary, logout, currentBook, isRefreshingLibrary } =
		useGoogle();
	const isLargeScreen = useIsLargeScreen();

	const handleOpenMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const appBar = (
		<div>
			<Hidden mdDown>
				<AppBar className={"appBarRight"} position="fixed">
					<Toolbar>
						<Typography noWrap variant="h6">
							Stream Audiobook Player
						</Typography>
						<IconButton
							edge="end"
							sx={{ marginLeft: "auto" }}
							onClick={handleOpenMenu}
							aria-label="menu"
						>
							<MoreVert />
						</IconButton>
					</Toolbar>
					{isRefreshingLibrary ? (
						<LinearProgress sx={{ zIndex: 1101 }} />
					) : null}
				</AppBar>
			</Hidden>
			<Hidden mdUp>
				<AppBar position="fixed">
					<Toolbar>
						<IconButton
							color="inherit"
							edge="start"
							aria-label="Toggle drawer"
							onClick={() => setOpenDrawer(true)}
						>
							<MenuIcon />
						</IconButton>
						<Typography noWrap variant="h6">
							Stream Audiobook Player
						</Typography>
						<IconButton
							edge="end"
							sx={{ marginLeft: "auto" }}
							onClick={handleOpenMenu}
							aria-label="menu"
						>
							<MoreVert />
						</IconButton>
					</Toolbar>
					{isRefreshingLibrary ? (
						<LinearProgress sx={{ zIndex: 1101 }} />
					) : null}
				</AppBar>
			</Hidden>
		</div>
	);

	const handleOpen = () => {
		setOpenFolderDialog(true);
		handleCloseMenu();
	};

	return (
		<Div100vh>
			<StyledDashboardContainer>
				<Sidebar />
				{appBar}
				<div className={isLargeScreen ? "bodyRight" : "body"}>
					<Body />
				</div>
				<Menu
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleCloseMenu}
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
					transformOrigin={{ horizontal: "center", vertical: "top" }}
				>
					{!showTrackController && (
						<MenuItem onClick={handleOpen}>Set Drive Directory</MenuItem>
					)}
					{!showTrackController && (
						<MenuItem
							onClick={() => {
								refreshLibrary();
								handleCloseMenu();
							}}
						>
							Refresh Library
						</MenuItem>
					)}
					{currentBook && !showTrackController && (
						<MenuItem
							onClick={() => {
								setOpenCoverDialog(true);
								handleCloseMenu();
							}}
						>
							Change Book Cover
						</MenuItem>
					)}
					<MenuItem
						onClick={() => {
							toggleDarkMode();
							handleCloseMenu();
						}}
					>
						Toggle Dark Mode
					</MenuItem>

					<MenuItem
						onClick={() => {
							navigate("/appinfo");
							handleCloseMenu();
						}}
					>
						App Information
					</MenuItem>
					<MenuItem
						onClick={() => {
							navigate("/privacypolicy");
							handleCloseMenu();
						}}
					>
						Privacy Policy
					</MenuItem>
					<MenuItem
						onClick={() => {
							logout();
							handleCloseMenu();
						}}
					>
						Log Out
					</MenuItem>
				</Menu>
				<Suspense fallback={null}>
					{openFolderDialog && (
						<FolderSelectDialog
							open={openFolderDialog}
							setOpen={setOpenFolderDialog}
						/>
					)}
				</Suspense>
				<Suspense fallback={null}>
					{openCoverDialog && (
						<ChangeCoverDialog
							open={openCoverDialog}
							setOpen={setOpenCoverDialog}
						/>
					)}
				</Suspense>
			</StyledDashboardContainer>
		</Div100vh>
	);
};

export default Dashboard;

// Styled Components
const StyledDashboardContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	height: "100%",
	width: "100%",
	overflow: "hidden",

	".appBarRight": {
		width: `calc(100% - ${theme.drawer.width}px)`,
	},

	".body": {
		paddingTop: theme.mixins.toolbar.minHeight,
		width: "100%",
		height: "100%",
	},

	".bodyRight": {
		paddingTop: theme.mixins.toolbar.minHeight,
		marginLeft: theme.drawer.width,
		width: "100%",
		height: "100%",
	},
}));
