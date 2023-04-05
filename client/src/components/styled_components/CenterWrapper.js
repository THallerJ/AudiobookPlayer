import { Box, styled } from '@mui/material';

const CenterWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullsize',
})(({ fullsize }) => ({
  height: fullsize ? '100vh' : '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default CenterWrapper;
