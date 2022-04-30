import React from "react";
import MediaPlayer from "../MediaPlayer/MediaPlayer";
import SmallMediaPlayer from "../MediaPlayer/SmallMediaPlayer";
import BookList from "../Books/BookList";
import TrackController from "../MediaPlayer/TrackController";
import { Box } from "@mui/system";
import { Paper, Hidden, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MediaPlayerContextProvider } from "../../contexts/MediaPlayerContext";
import { useDashboard } from "../../contexts/DashboardContext";

const Body = () => {
	const theme = useTheme();
	const { showTrackController } = useDashboard();

	return (
		<MediaPlayerContextProvider>
			<Box
				sx={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						height: showTrackController ? "100%" : "90%",
						overflow: "auto",
					}}
				>
					{useMediaQuery(theme.breakpoints.up("sm")) || !showTrackController ? (
						<BookList />
					) : (
						<TrackController />
					)}
				</Box>
				{useMediaQuery(theme.breakpoints.up("sm")) || !showTrackController ? (
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
			</Box>
		</MediaPlayerContextProvider>
	);
};

export default Body;
