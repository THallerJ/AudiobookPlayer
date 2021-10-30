import React from "react";
import {
	Typography,
	Hidden,
	IconButton,
	AppBar,
	Toolbar,
	useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import Body from "./Body";
import { useDashboard } from "../contexts/DashboardContext";
import MoreVert from "@mui/icons-material/MoreVert";
import { styled, useTheme } from "@mui/material/styles";

const Dashboard = () => {
	const { setOpenDrawer } = useDashboard();
	const theme = useTheme();

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
							onClick={() => console.log("icon clicked")}
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
							onClick={() => console.log("icon clicked")}
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
		</StyledDashboardContainer>
	);
};

export default Dashboard;

// Styled Components
const StyledDashboardContainer = styled("div")(({ theme }) => ({
	display: "flex",

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
