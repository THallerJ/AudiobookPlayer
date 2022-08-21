import React, { Suspense } from "react";
import BookList from "../Books/BookList";
import { Box } from "@mui/system";
import { Paper, Hidden, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDashboard } from "../../contexts/DashboardContext";
import { MediaPlayerContextProvider } from "../../contexts/MediaPlayerContext";

const TrackController = React.lazy(() =>
	import("../MediaPlayer/TrackController")
);
const SmallMediaPlayer = React.lazy(() =>
	import("../MediaPlayer/SmallMediaPlayer")
);
const MediaPlayer = React.lazy(() => import("../MediaPlayer/MediaPlayer"));

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
						<Suspense fallback={null}>
							<TrackController />
						</Suspense>
					)}
				</Box>
				{useMediaQuery(theme.breakpoints.up("sm")) || !showTrackController ? (
					<Box boxShadow={6}>
						<Paper elevation={0} sx={{ overflow: "hidden" }}>
							<Hidden smDown>
								<Suspense fallback={null}>
									<MediaPlayer />
								</Suspense>
							</Hidden>
							<Hidden smUp>
								<Suspense fallback={null}>
									<SmallMediaPlayer />
								</Suspense>
							</Hidden>
						</Paper>
					</Box>
				) : null}
			</Box>
		</MediaPlayerContextProvider>
	);
};

export default Body;
