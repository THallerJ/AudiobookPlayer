import React, { useState, useEffect } from "react";
import {
	Typography,
	Card,
	CardMedia,
	CardActionArea,
	Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useGoogle } from "../contexts/GoogleContext";
import defaultBookCover from "../assets/images/defaultBookCover.jpg";

const Book = ({ book }) => {
	const [showOverlay, setShowOverlay] = useState();
	const { setCurrentBook } = useGoogle();
	const [hasCover, setHasCover] = useState();

	useEffect(() => {
		setHasCover(book.coverImageUrl ? true : false);
	}, [book]);

	useEffect(() => {
		if (!hasCover) {
			setShowOverlay(true);
		} else {
			setShowOverlay(false);
		}
	}, [hasCover]);

	function onMouseEnter() {
		if (hasCover) setShowOverlay(true);
	}

	function onMouseLeave() {
		if (hasCover) setShowOverlay(false);
	}

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
			<Typography variant="caption">{book.name}</Typography>
		</Box>
	) : null;

	return (
		<StyledCard
			raised={true}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<CardActionArea>
				<CardMedia
					component="img"
					image={hasCover ? book.coverImageUrl : defaultBookCover}
					onClick={() => setCurrentBook(book)}
				/>
				{overlay}
			</CardActionArea>
		</StyledCard>
	);
};

export default Book;

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
