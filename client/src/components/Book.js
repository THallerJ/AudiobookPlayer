import React, { useState } from "react";
import {
	Typography,
	Card,
	CardMedia,
	CardActionArea,
	Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const BookCovers = ({ title, imageLink }) => {
	const [showOverlay, setShowOverlay] = useState(false);

	const overlay = showOverlay ? (
		<Box
			sx={{
				position: "absolute",
				bottom: 0,
				left: 0,
				width: "100%",
				bgcolor: "rgba(0, 0, 0, 0.75)",
				color: "white",
				padding: "15px",
			}}
		>
			<Typography variant="caption">{title}</Typography>
		</Box>
	) : null;

	return (
		<StyledCard
			raised={true}
			onMouseEnter={() => setShowOverlay(true)}
			onMouseLeave={() => setShowOverlay(false)}
		>
			<CardActionArea onClick={() => console.log(`clicked "${title}"}`)}>
				<CardMedia component="img" image={imageLink} />
				{overlay}
			</CardActionArea>
		</StyledCard>
	);
};

export default BookCovers;

const StyledCard = styled(Card)(({ theme }) => ({
	position: "relative",

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
