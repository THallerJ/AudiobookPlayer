import React, { useState, useEffect } from "react";
import { Typography, Card, CardMedia, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useGoogle } from "../contexts/GoogleContext";
import { useMediaPlayer } from "../contexts/MediaPlayerContext";
import defaultBookCover from "../assets/images/defaultBookCover.jpg";

const Book = ({ book }) => {
	const [showTitleOverlay, setShowTitleOverlay] = useState();
	const { setCurrentBook } = useGoogle();
	const { booksProgress } = useMediaPlayer();
	const [hasCover, setHasCover] = useState();

	useEffect(() => {
		setHasCover(book.coverImageUrl ? true : false);
	}, [book]);

	useEffect(() => {
		if (!hasCover) {
			setShowTitleOverlay(true);
		} else {
			setShowTitleOverlay(false);
		}
	}, [hasCover]);

	function onMouseEnter() {
		if (hasCover) setShowTitleOverlay(true);
	}

	function onMouseLeave() {
		if (hasCover) setShowTitleOverlay(false);
	}

	const titleOverlay = showTitleOverlay ? (
		<Box
			sx={{
				position: "absolute",
				bottom: 0,
				left: 0,
				width: "150px",
				bgcolor: "rgba(0, 0, 0, 0.75)",
				color: "white",
				padding: "15px",
			}}
		>
			<Typography variant="caption">{book.name}</Typography>
		</Box>
	) : null;

	const resumeOverlay = booksProgress[book.id] ? (
		<Box
			sx={{
				position: "absolute",
				top: 0,
				width: "100%",
			}}
		>
			<Button
				fullWidth
				size="small"
				variant="contained"
				onClick={() => console.log("resume")}
			>
				resume
			</Button>
		</Box>
	) : null;

	return (
		<StyledCard
			raised={true}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<CardMedia
				component="img"
				image={hasCover ? book.coverImageUrl : defaultBookCover}
				onClick={(e) => {
					setCurrentBook(book);
				}}
			/>
			{resumeOverlay}
			{titleOverlay}
		</StyledCard>
	);
};

export default Book;

const StyledCard = styled(Card)(({ theme }) => ({
	position: "relative",

	"&:hover": {
		cursor: "pointer",
	},

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
