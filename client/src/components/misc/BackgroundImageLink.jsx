import { Typography, Link } from '@mui/material';

const BackgroundImageLink = ({ darkMode }) => {
  return (
    <Typography variant="caption" color={darkMode ? 'black' : 'white'}>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        href="https://www.freepik.com/free-vector/gradient-white-monochrome-background_15273829.htm#page=5&query=background%20white&position=19&from_view=search&track=sph"
      >
        Image
      </Link>
      {' by Freepik'}
    </Typography>
  );
};

export default BackgroundImageLink;
