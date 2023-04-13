import { CircularProgress, Typography, useTheme } from '@mui/material';
import BaseDialog from './components/BaseDialog';
import { useGoogle } from '../../contexts/GoogleContext/GoogleContext';
import BookCoverList from '../books/BookCoverList';
import CenterWrapper from '../styled_components/CenterWrapper';
import useBookCovers from './hooks/useBookCovers';

const ChangeCoverDialog = ({ open, setOpen }) => {
  const theme = useTheme();
  const { currentBook, updateBookCover, setOverridedCovers } = useGoogle();
  const [bookCovers, selectedCover, loading] = useBookCovers();

  const renderContent = () => {
    if (loading)
      return (
        <CenterWrapper>
          <CircularProgress />
        </CenterWrapper>
      );

    if (bookCovers.length)
      return (
        <BookCoverList
          padding={theme.spacing(1)}
          spacing={theme.spacing(1)}
          bookCovers={bookCovers}
        />
      );

    return (
      <CenterWrapper>
        <Typography>No covers found</Typography>
      </CenterWrapper>
    );
  };

  const handleOk = () => {
    updateBookCover(selectedCover);

    setOverridedCovers((prevState) => {
      let matchFound = false;

      const newState = prevState.map((obj) => {
        if (obj.id === currentBook.id) {
          matchFound = true;
          return { ...obj, coverImageUrl: selectedCover };
        }

        return obj;
      });

      if (matchFound) return newState;

      return [
        ...newState,
        { id: currentBook.id, coverImageUrl: selectedCover },
      ];
    });

    setOpen(false);
  };

  return (
    <BaseDialog
      title={currentBook.name}
      content={renderContent()}
      open={open}
      setOpen={setOpen}
      ok={handleOk}
      cancel={() => setOpen(false)}
      height="80%"
      width="30%"
    />
  );
};

export default ChangeCoverDialog;
