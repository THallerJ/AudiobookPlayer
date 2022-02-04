import React from "react";
import {
	Drawer,
	ListItem,
	ListItemText,
	List,
	Typography,
	Divider,
	Hidden,
	Tooltip,
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

	function generateListItemClassName(chapter) {
		if (playingChapter) {
			if (!playingChapter.data.id.localeCompare(chapter.id)) {
				return "playingChapter";
			}
		}

		return null;
	}

	const drawerContent = (
		<StyledDrawerContent>
			<Typography noWrap variant="subtitle2" align="center">
				{currentBook ? currentBook.name : "NO BOOK SELECTED"}
			</Typography>
			<Divider />
			<List>
				{currentBook
					? currentBook.chapters.map((chapter, index) => {
							return (
								<Tooltip
									title={chapter.name}
									followCursor={true}
									placement="right-end"
									enterDelay={1000}
								>
									<ListItem
										className={generateListItemClassName(chapter)}
										key={chapter.id}
										divider={true}
										dense={true}
										button={true}
										onClick={() => {
											setPlayingChapter({ data: chapter, index: index });
											setPlayingBook(currentBook);
										}}
									>
										<ListItemText
											primary={chapter.name}
											primaryTypographyProps={{ noWrap: true }}
										/>
									</ListItem>
								</Tooltip>
							);
					  })
					: null}
			</List>
		</StyledDrawerContent>
	);

	return (
		<div>
			<Hidden mdDown>
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
