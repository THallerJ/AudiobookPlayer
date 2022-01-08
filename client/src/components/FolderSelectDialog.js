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
import { useDashboard } from "../contexts/DashboardContext";

const FolderSelectDialog = () => {
	const { getFolders, setRootDirectory } = useGoogle();
	const { openRootDialog, setOpenRootDialog } = useDashboard();
	const [loading, setLoading] = useState(false);
	const [selectedFolders, setSelectedFolders] = useState([]);
	const [folders, setFolders] = useState([]);

	const updateFolders = useCallback(
		async (rootId) => {
			setLoading(true);
			const folders = await getFolders(rootId);
			setFolders(folders);
			setLoading(false);
		},
		[getFolders]
	);

	function updateBreadCrumbs(rootId, index) {
		setSelectedFolders((state) => state.slice(0, index));
		updateFolders(rootId);
	}

	useEffect(() => {
		const fetchData = async () => {
			updateFolders("root");
		};

		if (openRootDialog) {
			fetchData();
		} else {
			setFolders([]);
			setSelectedFolders([]);
		}
	}, [getFolders, updateFolders, openRootDialog]);

	function renderFolders() {
		if (loading) {
			return (
				<StyledCenterWrapper>
					<CircularProgress />
				</StyledCenterWrapper>
			);
		} else {
			if (folders.length === 0) {
				return (
					<StyledCenterWrapper>
						<Typography variant="subtitle2">
							There are no folders here
						</Typography>
					</StyledCenterWrapper>
				);
			} else {
				return (
					<List>
						{folders.map((data, index) => {
							return (
								<ListItem
									key={data.id}
									onClick={() => {
										updateFolders(data.id);
										setSelectedFolders((state) => [
											...state,
											{ id: data.id, name: data.name },
										]);
									}}
									button={true}
									dense={true}
									divider={index === folders.length - 1 ? false : true}
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

	function renderBreadCrumbs() {
		return (
			<Breadcrumbs>
				<Link
					component={StyledLinkButton}
					onClick={() => updateBreadCrumbs("root", 0)}
					underline="none"
					variant="caption"
				>
					root
				</Link>
				{selectedFolders.length > 0
					? selectedFolders.map((data, index) => {
							return (
								<Link
									key={data.id}
									component={StyledLinkButton}
									onClick={() => updateBreadCrumbs(data.id, index + 1)}
									underline="none"
									variant="caption"
								>
									{data.name}
								</Link>
							);
					  })
					: null}
				<Link />
			</Breadcrumbs>
		);
	}

	return (
		<Box>
			<Dialog
				open={openRootDialog}
				onBackdropClick={() => setOpenRootDialog(false)}
			>
				<DialogTitle>
					<div>
						<Typography align="center" variant="h6">
							Set Audiobook Directory
						</Typography>
					</div>
					<Divider />
					{renderBreadCrumbs()}
				</DialogTitle>
				<DialogContent> {renderFolders()}</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setRootDirectory(
								selectedFolders.length > 0
									? selectedFolders[selectedFolders.length - 1].id
									: "root"
							);
							setOpenRootDialog(false);
						}}
						variant="text"
					>
						OK
					</Button>
					<Button onClick={() => setOpenRootDialog(false)} variant="text">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default FolderSelectDialog;

// Styled Components
const StyledLinkButton = styled(Button)(({ theme }) => ({
	textTransform: "none",
}));

const StyledCenterWrapper = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
}));
