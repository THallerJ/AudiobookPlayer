import React, { useEffect, useState, useCallback } from "react";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	Typography,
	Divider,
	List,
	ListItem,
	ListItemText,
	Breadcrumbs,
	Link,
	CircularProgress,
	Box,
} from "@mui/material";
import { useGoogle } from "../contexts/GoogleContext";
import { styled } from "@mui/material/styles";

const FolderSelectDialog = ({ open, setOpen }) => {
	const { getFolders } = useGoogle();
	const [loading, setLoading] = useState(false);

	const [folderList, setFolderList] = useState([]);

	const updateFolderList = useCallback(
		async (rootId) => {
			setLoading(true);
			const folders = await getFolders(rootId);
			setFolderList(folders);
			setLoading(false);
		},
		[getFolders]
	);

	useEffect(() => {
		const fetchData = async () => {
			updateFolderList("root");
		};

		open ? fetchData() : setFolderList([]);
	}, [getFolders, updateFolderList, open]);

	function folders() {
		if (loading) {
			return (
				<StyledCenter>
					<CircularProgress />
				</StyledCenter>
			);
		} else {
			if (folderList.length === 0) {
				return (
					<StyledCenter>
						<Typography variant="subtitle2">
							There are no folders here
						</Typography>
					</StyledCenter>
				);
			} else {
				return (
					<List>
						{folderList.map((data, index) => {
							return (
								<ListItem
									key={data.id}
									onClick={() => {
										updateFolderList(data.id);
									}}
									button={true}
									dense={true}
									divider={index === folderList.length - 1 ? false : true}
								>
									<ListItemText primary={data.name} />
								</ListItem>
							);
						})}
					</List>
				);
			}
		}
	}

	return (
		<div>
			<Dialog open={open} onBackdropClick={() => setOpen(false)}>
				<DialogTitle>
					<Typography align="center" variant="h6">
						Set Audiobook Directory
					</Typography>
					<Divider />
					<Breadcrumbs aria-label="breadcrumb">
						<Link
							component={StyledLinkButton}
							onClick={() => console.log("breadcrumb clicked")}
							underline="none"
							variant="caption"
						>
							Folder 1
						</Link>
						<Link
							component={StyledLinkButton}
							underline="none"
							variant="caption"
						>
							Folder 2
						</Link>
						<Link
							component={StyledLinkButton}
							underline="none"
							variant="caption"
						>
							Folder 3
						</Link>
					</Breadcrumbs>
				</DialogTitle>
				<DialogContent> {folders()}</DialogContent>
				<DialogActions className="thing">
					<Button variant="text">OK</Button>
					<Button onClick={() => setOpen(false)} variant="text">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default FolderSelectDialog;

// Styled Components
const StyledLinkButton = styled(Button)(({ theme }) => ({
	textTransform: "lowercase",
}));

const StyledCenter = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
}));
