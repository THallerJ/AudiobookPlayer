import HeadphonesIcon from '@mui/icons-material/Headphones';
import { useGoogle } from '../../contexts/GoogleContext/GoogleContext';
import { useMediaPlayer } from '../../contexts/MediaPlayerContext/MediaPlayerContext';
import Overlay from '../misc/Overlay';
import BookCover from './components/BookCover';
import useBookState from './hooks/useBookState';

const Book = ({ book }) => {
  const { setCurrentBook } = useGoogle();
  const { booksProgress, resumePlayback } = useMediaPlayer();
  const {
    hasCover,
    setShowTitleOverlay,
    showTitleOverlay,
    showPlayingOverlay,
    showSelectedOverlay,
  } = useBookState(book);

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
