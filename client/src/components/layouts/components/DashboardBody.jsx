import { Suspense, lazy } from 'react';
import { Paper, Hidden, CircularProgress, Box, useTheme } from '@mui/material';
import { useDashboard } from '../../../contexts/DashboardContext/DashboardContext';
import { MediaPlayerContextProvider } from '../../../contexts/MediaPlayerContext/MediaPlayerContext';
import BookCoverList from '../../books/BookCoverList';
import CenterWrapper from '../../styled_components/CenterWrapper';
import SmallMediaPlayer from '../../media_player/SmallMediaPlayer';
import MediaPlayer from '../../media_player/MediaPlayer';
import useIsLargeScreen from '../../../hooks/useIsLargeScreen';
import useBookLibrary from '../hooks/useBookLibrary';

const EmptyLibrary = lazy(() => import('../../books/EmptyLibrary'));
const TrackController = lazy(() =>
  import('../../media_player/TrackController')
);

const Body = () => {
  const theme = useTheme();
  const { showTrackController } = useDashboard();
  const isLargeScreen = useIsLargeScreen();
  const [bookCovers, isLoadingLibrary] = useBookLibrary();

  const renderMain = () => {
    if (isLoadingLibrary)
      return (
        <CenterWrapper>
          <CircularProgress />
        </CenterWrapper>
      );

    if (!isLargeScreen && showTrackController)
      return (
        <Suspense fallback={null}>
          <TrackController />
        </Suspense>
      );

    if (bookCovers && bookCovers.length)
      return (
        <BookCoverList
          bookCovers={bookCovers}
          padding={theme.spacing(2)}
          spacing={theme.spacing(3)}
        />
      );

    if (!bookCovers || !bookCovers.length) {
      return <EmptyLibrary />;
    }

    return null;
  };

  const renderMediaPlayer = () => {
    if (isLargeScreen || !showTrackController) {
      return (
        <Box boxShadow={6}>
          <Paper elevation={0} sx={{ overflow: 'hidden', p: 0, m: 0 }}>
            <Hidden smDown>
              <MediaPlayer />
            </Hidden>
            <Hidden smUp>
              <SmallMediaPlayer />
            </Hidden>
          </Paper>
        </Box>
      );
    }

    return null;
  };

  return (
    <MediaPlayerContextProvider>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            height: showTrackController ? '100%' : '90%',
            overflow: 'auto',
          }}
        >
          {renderMain()}
        </Box>
        {renderMediaPlayer()}
      </Box>
    </MediaPlayerContextProvider>
  );
};

export default Body;
