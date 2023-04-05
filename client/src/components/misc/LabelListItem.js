import LabelIcon from "@mui/icons-material/LabelOutlined";
import { Typography, ListItem, ListItemIcon, useTheme } from "@mui/material";
import useIsLargeScreen from "../../hooks/useIsLargeScreen";

const LabelListItem = ({ text }) => {
	const theme = useTheme();
	const isLargeScreen = useIsLargeScreen();

	return (
		<ListItem disableGutters={!isLargeScreen}>
			<ListItemIcon sx={{ minWidth: isLargeScreen ? 40 : 30 }}>
				<LabelIcon fontSize="small" />
			</ListItemIcon>
			<Typography>{text}</Typography>
		</ListItem>
	);
};

export default LabelListItem;
