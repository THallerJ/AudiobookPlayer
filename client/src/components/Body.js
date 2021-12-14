import React from "react";
import MediaPlayer from "./MediaPlayer";
import BookList from "./BookList";
import { Box } from "@mui/system";
import { Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MediaPlayerContextProvider } from "../contexts/MediaPlayerContext";

const Body = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box sx={{ height: "90%", overflow: "auto", p: theme.spacing(2) }}>
				<BookList />
			</Box>
			<Box sx={{ height: "10%" }} boxShadow={6}>
				<Paper elevation={0}>
					<MediaPlayerContextProvider>
						<MediaPlayer />
					</MediaPlayerContextProvider>
				</Paper>
			</Box>
		</Box>
	);
};

export default Body;
