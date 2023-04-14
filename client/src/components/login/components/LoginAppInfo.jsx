import { Typography, Link, styled, Box, useTheme } from '@mui/material';
import useIsLargeScreen from '../../../hooks/useIsLargeScreen';
import BackgroundImageLink from '../../misc/BackgroundImageLink';
import FeatureIcons from './FeatureIcons';
import MockupImage from './MockupImage';

const AppInfo = ({ scrollRef }) => {
  const theme = useTheme();
  const isLargeScreen = useIsLargeScreen();

  const renderInfo = () => (
    <Box className="info">
      <Box className="description" ref={scrollRef}>
        <Typography variant="h5" sx={{ pb: theme.spacing(2) }}>
          <strong>What is Stream Audiobook Player?</strong>
        </Typography>
        <Typography variant="body1">
          Stream Audiobook Player is a web app that allows users to stream DRM
          free audiobooks that are stored on their Google Drive.
        </Typography>
      </Box>
      <FeatureIcons />
      <Box className="privacyPolicy">
        <Typography variant="h5" sx={{ pb: theme.spacing(2) }}>
          <strong>Privacy Policy</strong>
        </Typography>
        <Typography variant="body1" sx={{ pb: theme.spacing(6) }}>
          Read the{' '}
          <Link underline="hover" href="/privacypolicy">
            privacy policy
          </Link>{' '}
          for more information about how the app uses your data.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifySelf: 'center',
          }}
        >
          {' '}
          {isLargeScreen && <BackgroundImageLink darkMode={false} />}
        </Box>
      </Box>
    </Box>
  );

  const renderVisuals = () => (
    <Box className="visuals">
      <MockupImage />
      {!isLargeScreen && <BackgroundImageLink />}
    </Box>
  );

  return (
    <StyledAppInfoContainer isLargeScreen={isLargeScreen}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isLargeScreen ? 'row' : 'column',
        }}
      >
        {renderInfo()}
        {renderVisuals()}
      </Box>
    </StyledAppInfoContainer>
  );
};

// Styled Components
const StyledAppInfoContainer = styled(Box)(({ theme, isLargeScreen }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minWidth: '100vw',

  '.info': {
    minHeight: '100vh',
    width: isLargeScreen ? '50%' : '100%',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  '.description': {
    padding: isLargeScreen ? theme.spacing(6) : theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },

  '.privacyPolicy': {
    width: '100%',
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },

  '.visuals': {
    minHeight: '100vh',
    width: isLargeScreen ? '50%' : '100%',
    background: `linear-gradient(15deg, black 55%, ${theme.palette.primary.main} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: isLargeScreen ? 'center' : 'space-between',
    flexDirection: 'column',
    paddingTop: isLargeScreen ? theme.spacing(0) : theme.spacing(10),
    paddingBottom: isLargeScreen ? theme.spacing(0) : theme.spacing(1),
  },
}));

export default AppInfo;
