import React from "react";
import Book from "./Book";
import { Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGoogle } from "../contexts/GoogleContext";

const BookList = () => {
	const theme = useTheme();
	const { library } = useGoogle();

	return (
		<Box sx={{ padding: theme.spacing(2) }}>
			<Grid item container spacing={theme.spacing(3)} justifyContent="center">
				{library
					? library.map((book) => (
							<Grid item key={`${book.id}`}>
								<Book book={book} />
							</Grid>
					  ))
					: null}
			</Grid>
		</Box>
	);
};

export default BookList;
