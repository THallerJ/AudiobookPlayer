import { useEffect, useState } from "react";
import {
	Button,
	Typography,
	List,
	ListItemButton,
	ListItemText,
	Breadcrumbs,
	Link,
	CircularProgress,
	styled,
} from "@mui/material";
import { useGoogle } from "../../contexts/GoogleContext/GoogleContext";
import { useApp } from "../../contexts/AppContext/AppContext";
import CenterWrapper from "../styled_components/CenterWrapper";
import BaseDialog from "./BaseDialog";
import useApiProgressCallback from "../../hooks/useApiProgressCallback";

const FolderSelectDialog = ({ open, setOpen }) => {
	const { getFolders, setRootDirectory } = useGoogle();
	const { axiosError } = useApp();
	const [selectedFolders, setSelectedFolders] = useState([]);
	const [folders, setFolders] = useState([]);

	useEffect(() => {
		if (axiosError && axiosError.code === 401) setOpen(false);
	}, [axiosError]);

	const [loading, updateFolders] = useApiProgressCallback(
		async (rootId) => {
			const folders = await getFolders(rootId);
			setFolders(folders);
		},
		[setFolders, getFolders]
	);

	const updateBreadCrumbs = (rootId, index) => {
		setSelectedFolders((state) => state.slice(0, index));
		updateFolders(rootId);
	};

	useEffect(() => {
		const fetchData = async () => {
			updateFolders("root");
		};

		if (open) {
			fetchData();
		} else {
			setFolders([]);
			setSelectedFolders([]);
		}
	}, [updateFolders, open]);

	const handleOk = () => {
		setRootDirectory(
			selectedFolders.length > 0
				? selectedFolders[selectedFolders.length - 1].id
				: "root"
		);
		setOpen(false);
	};

	const renderFolders = () => {
		if (loading) {
			return (
				<CenterWrapper>
					<CircularProgress />
				</CenterWrapper>
			);
		} else {
			if (folders.length === 0) {
				return (
					<CenterWrapper>
						<Typography variant="subtitle2">
							There are no folders here
						</Typography>
					</CenterWrapper>
				);
			} else {
				return (
					<List>
						{folders.map((data, index) => {
							return (
								<ListItemButton
									key={data.id}
									onClick={() => {
										updateFolders(data.id);
										setSelectedFolders((state) => [
											...state,
											{ id: data.id, name: data.name },
										]);
									}}
									dense={true}
									divider={index === folders.length - 1 ? false : true}
								>
									<ListItemText primary={data.name} />
								</ListItemButton>
							);
						})}
					</List>
				);
			}
		}
	};

	const renderBreadCrumbs = () => {
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
	};

	return (
		<BaseDialog
			title="Set Audiobook Directory"
			open={open}
			setOpen={setOpen}
			content={renderFolders()}
			headerContent={renderBreadCrumbs()}
			ok={handleOk}
			cancel={() => setOpen(false)}
			fixed={true}
			height="80%"
			width="20%"
		/>
	);
};

export default FolderSelectDialog;

// Styled Components
const StyledLinkButton = styled(Button)(({ theme }) => ({
	textTransform: "none",
}));
