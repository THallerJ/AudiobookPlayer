import React from "react";
import Book from "./Book";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const BookList = () => {
	const theme = useTheme();

	const bookArray = [];
	for (var i = 0; i < 30; i++) {
		bookArray.push({
			title: `Book Title ${i + 1}`,
			author: `Author Name${i + 1}`,
		});
	}

	return (
		<Grid item container spacing={theme.spacing(3)} justifyContent="center">
			{bookArray.map((book) => (
				<Grid item key={`${book.title + book.author}`}>
					<Book title={book.title} author={book.author} />
				</Grid>
			))}
		</Grid>
	);
};

export default BookList;
