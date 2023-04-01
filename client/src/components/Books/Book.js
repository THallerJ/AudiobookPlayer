import { useState, useEffect } from "react";
import { useGoogle } from "../../contexts/GoogleContext/GoogleContext";
import { useMediaPlayer } from "../../contexts/MediaPlayerContext/MediaPlayerContext";
import Overlay from "../misc/Overlay";
import BookCover from "./BookCover.js";
import HeadphonesIcon from "@mui/icons-material/Headphones";

const Book = ({ book }) => {
	const [showTitleOverlay, setShowTitleOverlay] = useState(false);
	const [showPlayingOverlay, setShowPlayingOverlay] = useState(false);
	const { setCurrentBook, currentBook, playingBook } = useGoogle();
	const { booksProgress, resumePlayback } = useMediaPlayer();
	const [hasCover, setHasCover] = useState();
	const [showSelectedOverlay, setShowSelectedOverlay] = useState(false);

	useEffect(() => {
		setHasCover(book.coverImageUrl ? true : false);
	}, [book]);

	useEffect(() => {
		if (currentBook) {
			setShowSelectedOverlay(book.name === currentBook.name ? true : false);
		}
	}, [currentBook]);

	useEffect(() => {
		if (playingBook)
			setShowPlayingOverlay(book.name === playingBook.name ? true : false);
	}, [playingBook, book]);

	useEffect(() => {
		if (!hasCover) {
			setShowTitleOverlay(true);
		} else {
			setShowTitleOverlay(false);
		}
	}, [hasCover]);

	const resumeOverlay = (
		<Overlay
			variant="button"
			showOverlay={booksProgress[book.id] && !showPlayingOverlay}
			text="resume"
			anchor="top"
			onClick={() => {
				resumePlayback(book.id);
				setCurrentBook(book);
			}}
		/>
	);

	const borderOverlay = (
		<Overlay
			variant="border"
			showOverlay={showSelectedOverlay && !showPlayingOverlay}
		/>
	);

	const titleOverlay = (
		<Overlay showOverlay={showTitleOverlay} anchor="bottom" text={book.name} />
	);

	const playingOverlay = (
		<Overlay
			showOverlay={showPlayingOverlay && !showSelectedOverlay}
			variant="fullSize"
			icon={<HeadphonesIcon fontSize="large" />}
			transparency="0.75"
		/>
	);

	const playingAndSelectedOverlay = (
		<Overlay
			showOverlay={showPlayingOverlay && showSelectedOverlay}
			variant="border"
			icon={<HeadphonesIcon fontSize="large" />}
			transparency="0.75"
		/>
	);

	const overlays = [
		borderOverlay,
		playingOverlay,
		playingAndSelectedOverlay,
		resumeOverlay,
		titleOverlay,
	];

	return (
		<BookCover
			title={book.name}
			imgUrl={book.coverImageUrl}
			height={225}
			width={150}
			overlays={overlays}
			onMouseEnter={() => {
				if (hasCover) setShowTitleOverlay(true);
			}}
			onMouseLeave={() => {
				if (hasCover) setShowTitleOverlay(false);
			}}
			onClick={() => {
				setCurrentBook(book);
			}}
		/>
	);
};

export default Book;
