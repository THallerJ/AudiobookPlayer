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
import { useGoogle } from "../contexts/GoogleContext";

const Sidebar = () => {
	const { openDrawer, setOpenDrawer } = useDashboard();
	const { currentBook, setPlayingChapter, playingChapter, setPlayingBook } =
		useGoogle();

	function handleDrawerClose() {
		setOpenDrawer(false);
	}

	const listItems = [];
	for (var i = 0; i < 20; i++) {
		listItems.push(`Chapter ${i + 1}`);
	}

	function generateListItemClassName(chapter) {
		if (playingChapter) {
			if (!playingChapter.id.localeCompare(chapter.id)) {
				return "playingChapter";
			}
		}

		return null;
	}

	const drawerContent = (
		<StyledDrawerContent>
			<Typography variant="subtitle2" align="center">
				{currentBook ? currentBook.name : "NO BOOK SELECTED"}
			</Typography>
			<Divider />
			<List>
				{currentBook
					? currentBook.chapters.map((chapter) => {
							return (
								<ListItem
									className={generateListItemClassName(chapter)}
									key={chapter.id}
									divider={true}
									dense={true}
									button={true}
									onClick={() => {
										setPlayingChapter(chapter);
										setPlayingBook(currentBook);
									}}
								>
									<ListItemText
										primary={chapter.name}
										primaryTypographyProps={{ noWrap: true }}
									/>
								</ListItem>
							);
					  })
					: null}
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

	".playingChapter": {
		backgroundColor: theme.palette.secondary.light,
		"&:hover": {
			backgroundColor: theme.palette.secondary.light,
		},
	},
}));
