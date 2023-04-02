import BookCover from "../books/BookCover";
import Overlay from "../misc/Overlay";
import CheckIcon from "@mui/icons-material/Check";

const BookCoverSelect = ({ bookCoverUrl, selectedCover, setSelectedCover }) => {
	const overlays = [
		<Overlay
			variant="fullSize"
			showOverlay={selectedCover === bookCoverUrl ? true : false}
			icon={<CheckIcon fontSize="large" />}
		/>,
	];

	return (
		<BookCover
			imgUrl={bookCoverUrl}
			height={150}
			width={100}
			overlays={overlays}
			onClick={() => {
				setSelectedCover(bookCoverUrl);
			}}
		/>
	);
};

export default BookCoverSelect;
