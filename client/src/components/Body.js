import React, { useEffect } from "react";
import MediaPlayer from "./MediaPlayer";
import SmallMediaPlayer from "./SmallMediaPlayer";
import BookList from "./BookList";
import TrackInfo from "./TrackInfo";
import { Box } from "@mui/system";
import { Paper, Hidden, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MediaPlayerContextProvider } from "../contexts/MediaPlayerContext";
import { useDashboard } from "../contexts/DashboardContext";

const Body = () => {
	const theme = useTheme();
	const { showTrackInfo } = useDashboard();

	useEffect(() => {
		console.log(showTrackInfo);
	}, [showTrackInfo]);

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box
				sx={{
					height: showTrackInfo ? "100%" : "90%",
					overflow: "auto",
					p: theme.spacing(2),
				}}
			>
				{useMediaQuery(theme.breakpoints.up("sm")) || !showTrackInfo ? (
					<BookList />
				) : (
					<TrackInfo />
				)}
			</Box>
			<MediaPlayerContextProvider>
				{useMediaQuery(theme.breakpoints.up("sm")) || !showTrackInfo ? (
					<Box boxShadow={6}>
						<Paper elevation={0} sx={{ overflow: "hidden" }}>
							<Hidden smDown>
								<MediaPlayer />
							</Hidden>
							<Hidden smUp>
								<SmallMediaPlayer />
							</Hidden>
						</Paper>
					</Box>
				) : null}
			</MediaPlayerContextProvider>
		</Box>
	);
};

export default Body;
