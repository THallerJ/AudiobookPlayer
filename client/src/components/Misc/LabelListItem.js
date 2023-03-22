import React from "react";
import LabelIcon from "@mui/icons-material/LabelOutlined";
import {
	Typography,
	ListItem,
	ListItemIcon,
	useMediaQuery,
	useTheme,
} from "@mui/material";

const LabelListItem = ({ text }) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

	return (
		<ListItem disableGutters={isSmallScreen}>
			<ListItemIcon sx={{ minWidth: isSmallScreen ? 40 : null }}>
				<LabelIcon fontSize="small" />
			</ListItemIcon>
			<Typography>{text}</Typography>
		</ListItem>
	);
};

export default LabelListItem;
