import CheckIcon from '@mui/icons-material/Check';
import BookCover from './BookCover';
import Overlay from '../../misc/Overlay';

const BookCoverSelect = ({ bookCoverUrl, selectedCover, setSelectedCover }) => {
  const overlays = [
    <Overlay
      key={bookCoverUrl}
      variant="fullSize"
      showOverlay={selectedCover === bookCoverUrl}
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
