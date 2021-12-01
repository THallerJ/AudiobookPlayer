import React from "react";
import Book from "./Book";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGoogle } from "../contexts/GoogleContext";

const BookListCovers = () => {
	const theme = useTheme();
	const { library } = useGoogle();

	return (
		<Grid item container spacing={theme.spacing(3)} justifyContent="center">
			{library
				? library.map((book) => (
						<Grid item key={`${book.name}`}>
							<Book title={book.name} imageLink={book.coverImageUrl} />
						</Grid>
				  ))
				: ""}
		</Grid>
	);
};

export default BookListCovers;
