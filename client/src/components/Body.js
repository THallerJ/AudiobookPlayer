import React from "react";
import MediaPlayer from "./MediaPlayer";
import ChapterList from "./ChapterList";
import { Box } from "@mui/system";
import { Paper } from "@mui/material";

const Body = () => {
	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box sx={{ overflow: "auto" }}>
				<ChapterList />
			</Box>
			<Box sx={{ height: "10%" }} boxShadow={5}>
				<Paper elevation={0}>
					<MediaPlayer />
				</Paper>
			</Box>
		</Box>
	);
};

export default Body;
