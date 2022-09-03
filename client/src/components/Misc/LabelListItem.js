import React from "react";
import LabelIcon from "@mui/icons-material/LabelOutlined";
import { Typography, ListItem, ListItemIcon } from "@mui/material";

const LabelListItem = ({ text }) => {
	return (
		<ListItem>
			<ListItemIcon>
				<LabelIcon fontSize="small" />
			</ListItemIcon>
			<Typography>{text}</Typography>
		</ListItem>
	);
};

export default LabelListItem;
