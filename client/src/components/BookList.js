import React from "react";
import Book from "./Book";
import EmptyLibrary from "./EmptyLibrary";
import { Grid, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGoogle } from "../contexts/GoogleContext";

const BookList = () => {
	const theme = useTheme();
	const { library } = useGoogle();

	return (
		<Box sx={{ padding: theme.spacing(2), height: "100%" }}>
			<Grid item container spacing={theme.spacing(3)} justifyContent="center">
				{library.length > 0 ? (
					library.map((book) => (
						<Grid item key={`${book.id}`}>
							<Book book={book} />
						</Grid>
					))
				) : (
					<EmptyLibrary />
				)}
			</Grid>
		</Box>
	);
};

export default BookList;
