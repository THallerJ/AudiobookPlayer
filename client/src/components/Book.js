import React from "react";
import {
	Typography,
	Card,
	CardMedia,
	CardContent,
	CardActionArea,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const BookCovers = ({ title, imageLink }) => {
	return (
		<StyledCard raised={true}>
			<CardActionArea onClick={() => console.log(`clicked "${title}"}`)}>
				<CardMedia component="img" image={imageLink} />
			</CardActionArea>
			<CardActionArea onClick={() => console.log("edit clicked")}>
				<CardContent>
					<Typography variant="subtitle2">{title}</Typography>
				</CardContent>
			</CardActionArea>
		</StyledCard>
	);
};

export default BookCovers;

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
