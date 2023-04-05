import { Grid, Box } from '@mui/material';

const BookCoverList = ({ bookCovers, padding, spacing }) => {
  return (
    <Box sx={{ padding, height: '100%' }}>
      <Grid item container spacing={spacing} justifyContent="center">
        {bookCovers &&
          bookCovers.map((bookCover, index) => (
            <Grid item key={bookCover.key || index}>
              {bookCover.image || bookCover}
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default BookCoverList;
