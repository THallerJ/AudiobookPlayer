import { Suspense, useState, useEffect, lazy } from "react";
import { Paper, Hidden, CircularProgress, Box, useTheme } from "@mui/material";
import { useDashboard } from "../../contexts/DashboardContext/DashboardContext";
import { MediaPlayerContextProvider } from "../../contexts/MediaPlayerContext/MediaPlayerContext";
import Book from "../books/Book";
import BookCoverList from "../books/BookCoverList";
import { useGoogle } from "../../contexts/GoogleContext/GoogleContext";
import CenterWrapper from "../styled_components/CenterWrapper";
import SmallMediaPlayer from "../media_player/SmallMediaPlayer";
import MediaPlayer from "../media_player/MediaPlayer";
import useIsLargeScreen from "../../hooks/useIsLargeScreen";

const EmptyLibrary = lazy(() => import("../books/EmptyLibrary"));
const TrackController = lazy(() => import("../media_player/TrackController"));

const Body = () => {
	const theme = useTheme();
	const { library, isLoadingLibrary } = useGoogle();
	const { showTrackController } = useDashboard();
	const [bookCovers, setBookCovers] = useState([]);
	const isLargeScreen = useIsLargeScreen();

	useEffect(() => {
		const temp = [];

		library.forEach((book, index) => {
			const newBookCover = { image: <Book book={book} />, key: book.id };
			temp.push(newBookCover);
		});

		setBookCovers(temp);
	}, [library]);

	const renderMain = (bookCovers) => {
		if (isLoadingLibrary) {
			return (
				<CenterWrapper>
					<CircularProgress />
				</CenterWrapper>
			);
		} else if (isLargeScreen || !showTrackController) {
			if (bookCovers && bookCovers.length) {
				return (
					<BookCoverList
						bookCovers={bookCovers}
						padding={theme.spacing(2)}
						spacing={theme.spacing(3)}
					/>
				);
			} else {
				return <EmptyLibrary />;
			}
		} else {
			return (
				<Suspense fallback={null}>
					<TrackController />
				</Suspense>
			);
		}
	};

	const renderMediaPlayer = () => {
		if (isLargeScreen || !showTrackController) {
			return (
				<Box boxShadow={6}>
					<Paper elevation={0} sx={{ overflow: "hidden", p: 0, m: 0 }}>
						<Hidden smDown>
							<MediaPlayer />
						</Hidden>
						<Hidden smUp>
							<SmallMediaPlayer />
						</Hidden>
					</Paper>
				</Box>
			);
		} else return null;
	};

	return (
		<MediaPlayerContextProvider>
			<Box
				sx={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						height: showTrackController ? "100%" : "90%",
						overflow: "auto",
					}}
				>
					{renderMain(bookCovers)}
				</Box>
				{renderMediaPlayer()}
			</Box>
		</MediaPlayerContextProvider>
	);
};

export default Body;
