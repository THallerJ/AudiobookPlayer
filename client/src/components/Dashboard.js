import React, { useState } from "react";
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
import Sidebar from "./Sidebar";
import Body from "./Body";
import { useDashboard } from "../contexts/DashboardContext";
import { useApp } from "../contexts/AppContext";
import MoreVert from "@mui/icons-material/MoreVert";
import { styled, useTheme } from "@mui/material/styles";
import { useGoogle } from "../contexts/GoogleContext";
import FolderSelectDialog from "./FolderSelectDialog";
import Div100vh from "react-div-100vh";

const Dashboard = () => {
	const { setOpenDrawer, setOpenRootDialog } = useDashboard();
	const { toggleDarkMode } = useApp();
	const [anchorEl, setAnchorEl] = useState(null);
	const theme = useTheme();
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
				<Sidebar />
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
							logout();
							handleCloseMenu();
						}}
					>
						Log Out
					</MenuItem>
				</Menu>
				<FolderSelectDialog />
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
