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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import Body from "./Body";
import { useDashboard } from "../contexts/DashboardContext";
import MoreVert from "@mui/icons-material/MoreVert";
import { styled, useTheme } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";
import FolderSelectDialog from "./FolderSelectDialog";

const Dashboard = () => {
	const { setOpenDrawer } = useDashboard();
	const [openDialog, setOpenDialog] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const { logout } = useAuth();
	const theme = useTheme();

	function handleOpenMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleCloseMenu() {
		setAnchorEl(null);
	}

	const appBar = (
		<div>
			<Hidden smDown>
				<AppBar className={"appBarRight"} color="inherit" position="fixed">
					<Toolbar>
						<Typography noWrap variant="h6">
							Audiobook Player
						</Typography>
						<IconButton
							edge="end"
							sx={{ marginLeft: "auto" }}
							onClick={handleOpenMenu}
						>
							<MoreVert />
						</IconButton>
					</Toolbar>
				</AppBar>
			</Hidden>
			<Hidden smUp>
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
							Audiobook Player
						</Typography>
						<IconButton
							edge="end"
							sx={{ marginLeft: "auto" }}
							onClick={handleOpenMenu}
						>
							<MoreVert />
						</IconButton>
					</Toolbar>
				</AppBar>
			</Hidden>
		</div>
	);

	return (
		<StyledDashboardContainer>
			<Sidebar />
			{appBar}
			<div
				className={
					useMediaQuery(theme.breakpoints.up("sm")) ? "bodyRight" : "body"
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
						setOpenDialog(true);
						handleCloseMenu();
					}}
				>
					Set File Directory
				</MenuItem>
				<MenuItem
					onClick={() => {
						console.log("clicked toggle dark mode");
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
			<FolderSelectDialog open={openDialog} setOpen={setOpenDialog} />
		</StyledDashboardContainer>
	);
};

export default Dashboard;

// Styled Components
const StyledDashboardContainer = styled("div")(({ theme }) => ({
	display: "flex",
	height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
	width: "100%",

	".appBarRight": {
		width: `calc(100% - ${theme.drawer.width}px)`,
	},

	".body": {
		paddingTop: theme.mixins.toolbar.minHeight,
		width: "100%",
	},

	".bodyRight": {
		paddingTop: theme.mixins.toolbar.minHeight,
		marginLeft: theme.drawer.width,
		width: "100%",
	},
}));
