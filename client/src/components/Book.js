import React from "react";
import {
	Typography,
	Card,
	CardMedia,
	CardContent,
	CardActionArea,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Book = ({ title, author }) => {
	return (
		<StyledCard raised={true}>
			<CardActionArea
				onClick={() => console.log(`clicked "${title}" by ${author}`)}
			>
				<CardMedia
					component="img"
					image="https://s26162.pcdn.co/wp-content/uploads/2020/01/Sin-Eater-by-Megan-Campisi.jpg"
				/>
			</CardActionArea>
			<CardActionArea onClick={() => console.log("edit clicked")}>
				<CardContent>
					<Typography variant="subtitle2">{title}</Typography>
					<Typography variant="caption">{author}</Typography>
				</CardContent>
			</CardActionArea>
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
