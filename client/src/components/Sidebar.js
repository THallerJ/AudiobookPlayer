import React from "react";
import {
	Drawer,
	ListItem,
	ListItemText,
	List,
	Typography,
	Divider,
	Hidden,
} from "@mui/material";
import { useDashboard } from "../contexts/DashboardContext";
import { styled } from "@mui/material/styles";

const Sidebar = () => {
	const { openDrawer, setOpenDrawer } = useDashboard();

	function handleDrawerClose() {
		setOpenDrawer(false);
	}

	const listItems = [];
	for (var i = 0; i < 20; i++) {
		listItems.push(`Chapter ${i + 1}`);
	}

	const drawerContent = (
		<StyledDrawerContent>
			<Typography variant="subtitle2" align="center">
				CHAPTERS
			</Typography>
			<Divider />
			<List>
				{listItems.map((item) => {
					return (
						<ListItem
							divider={true}
							dense={true}
							button={true}
							onClick={() => console.log(`${item} selected`)}
						>
							<ListItemText
								primary={item}
								primaryTypographyProps={{ noWrap: "true" }}
							/>
							<Typography variant="caption">00:00</Typography>
						</ListItem>
					);
				})}
			</List>
		</StyledDrawerContent>
	);

	return (
		<div>
			<Hidden smDown>
				<Drawer
					variant="persistent"
					anchor="left"
					open={true}
					PaperProps={{ component: StyledPaper }}
				>
					{drawerContent}
				</Drawer>
			</Hidden>
			<Hidden mdUp>
				<Drawer
					anchor="left"
					open={openDrawer}
					close={() => handleDrawerClose}
					ModalProps={{ onBackdropClick: handleDrawerClose }}
					PaperProps={{ component: StyledPaper }}
				>
					{drawerContent}
				</Drawer>
			</Hidden>
		</div>
	);
};

export default Sidebar;

// Styled Components
const StyledPaper = styled("div")(({ theme }) => ({
	width: theme.drawer.width,
}));

const StyledDrawerContent = styled("div")(({ theme }) => ({
	".MuiTypography-subtitle2": {
		paddingLeft: theme.spacing(3),
		paddingTop: theme.spacing(1),
		color: theme.palette.text.secondary,
	},
}));
