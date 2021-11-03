import React from "react";
import {
	IconButton,
	Typography,
	Card,
	CardMedia,
	CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

const Book = ({ title, author }) => {
	return (
		<StyledCard raised={true}>
			<CardMedia
				component="img"
				image="https://s26162.pcdn.co/wp-content/uploads/2020/01/Sin-Eater-by-Megan-Campisi.jpg"
			/>
			<CardContent>
				<Typography variant="subtitle2">{title}</Typography>
				<Typography variant="caption">{author}</Typography>
			</CardContent>
			<IconButton>
				<EditIcon fontSize="small" />
			</IconButton>
		</StyledCard>
	);
};

export default Book;

const StyledCard = styled(Card)(({ theme }) => ({
	".MuiCardContent-root": {
		padding: theme.spacing(1),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
	},

	".MuiCardMedia-root": {
		width: 150,
	},
}));
