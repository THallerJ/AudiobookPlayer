import { Card, CardMedia, styled } from '@mui/material';
import defaultBookCover from '../../../assets/images/defaultBookCover.jpg';

const BookCover = ({
  title,
  imgUrl,
  height,
  width,
  overlays,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <StyledCard
      height={height}
      width={width}
      raised
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardMedia
        title={title}
        component="img"
        image={imgUrl || defaultBookCover}
        onClick={() => onClick()}
        alt={title}
      />
      {overlays &&
        overlays.map((overlay, index) => (
          <div key={`${title}${width + height + overlays.length + index}`}>
            {overlay}
          </div>
        ))}
    </StyledCard>
  );
};

export default BookCover;

// Styled Components
const StyledCard = styled(Card)(({ theme, height, width }) => ({
  position: 'relative',

  '&:hover': {
    cursor: 'pointer',
  },

  '.MuiCardContent-root': {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },

  '.MuiCardMedia-root': {
    width,
    height,
  },
}));
