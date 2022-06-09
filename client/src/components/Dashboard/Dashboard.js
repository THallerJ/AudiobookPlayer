import React, { useState, Suspense } from "react";
import {
	Typography,
	Hidden,
	IconButton,
	AppBar,
	Toolbar,
	useMediaQuery,
	Menu,
	MenuItem,
	LinearProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Body from "./Body";
import { useDashboard } from "../../contexts/DashboardContext";
import { useApp } from "../../contexts/AppContext";
import MoreVert from "@mui/icons-material/MoreVert";
import { styled, useTheme } from "@mui/material/styles";
import { useGoogle } from "../../contexts/GoogleContext";
import Div100vh from "react-div-100vh";
import { useHistory } from "react-router-dom";

const FolderSelectDialog = React.lazy(() =>
	import("../Dialogs/FolderSelectDialog")
);
const Sidebar = React.lazy(() => import("./Sidebar"));

const Dashboard = () => {
	const theme = useTheme();
	const history = useHistory();

	const { setOpenDrawer, setOpenRootDialog } = useDashboard();
	const { toggleDarkMode } = useApp();
	const [anchorEl, setAnchorEl] = useState(null);
	const { refreshLibrary, logout, isLoadingRefresh } = useGoogle();

	function handleOpenMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleCloseMenu() {
		setAnchorEl(null);
	}

	const appBar = (
		<div>
			<Hidden mdDown>
				<AppBar className={"appBarRight"} color="inherit" position="fixed">
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
					{isLoadingRefresh ? <LinearProgress sx={{ zIndex: 1101 }} /> : null}
				</AppBar>
			</Hidden>
			<Hidden mdUp>
				<AppBar color="inherit" position="fixed">
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
					{isLoadingRefresh ? <LinearProgress sx={{ zIndex: 1101 }} /> : null}
				</AppBar>
			</Hidden>
		</div>
	);

	return (
		<Div100vh>
			<StyledDashboardContainer>
				<Suspense fallback={null}>
					<Sidebar />
				</Suspense>
				{appBar}
				<div
					className={
						useMediaQuery(theme.breakpoints.up("md")) ? "bodyRight" : "body"
					}
				>
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
					<MenuItem
						onClick={() => {
							setOpenRootDialog(true);
							handleCloseMenu();
						}}
					>
						Set Drive Directory
					</MenuItem>
					<MenuItem
						onClick={() => {
							refreshLibrary();
							handleCloseMenu();
						}}
					>
						Refresh Library
					</MenuItem>
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
							history.push("/about");
						}}
					>
						App Information
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
					<FolderSelectDialog />
				</Suspense>
			</StyledDashboardContainer>
		</Div100vh>
	);
};

export default Dashboard;

// Styled Components
const StyledDashboardContainer = styled("div")(({ theme }) => ({
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

	".centerProgress": {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "90%",
	},
}));
