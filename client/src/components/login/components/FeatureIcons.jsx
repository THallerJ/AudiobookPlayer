import { Grid, useTheme } from '@mui/material';
import RateIcon from '@mui/icons-material/AccessTime';
import HeadsetIcon from '@mui/icons-material/Headset';
import SyncIcon from '@mui/icons-material/Sync';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TextIcon from '../../misc/TextIcon';
import useIsLargeScreen from '../../../hooks/useIsLargeScreen';

const FeatureIcons = () => {
  const theme = useTheme();
  const isLargeScreen = useIsLargeScreen();

  return (
    <Grid
      container
      className="textIcons"
      spacing={isLargeScreen ? 4 : 2}
      justifyContent="flex-end"
      sx={{
        padding: isLargeScreen ? theme.spacing(3) : theme.spacing(3),
        backgroundColor: theme.palette.primaryAlt.main,
      }}
    >
      <Grid item xs={6} md={4}>
        <TextIcon Icon={HeadsetIcon} title="Stream">
          Stream audiobooks stored on your Google Drive
        </TextIcon>
      </Grid>
      <Grid item xs={6} md={4}>
        <TextIcon Icon={SyncIcon} title="Sync">
          Sync audiobook progress across devices
        </TextIcon>
      </Grid>
      <Grid item xs={6} md={4}>
        <TextIcon Icon={RateIcon} title="Playback Speed">
          Adjustable playback speed (0.5x to 4x speed)
        </TextIcon>
      </Grid>
      <Grid item xs={6} md={4}>
        <TextIcon Icon={MobileFriendlyIcon} title="Mobile Friendly">
          Desktop and mobile friendly user interface
        </TextIcon>
      </Grid>
      <Grid item xs={6} md={4}>
        <TextIcon Icon={AudioFileIcon} title="Audio Formats">
          Supports MP3, MPEG, OPUS, OGG, OGA, WAV, AAC, CAF, M4A, MP4, WEBA,
          WEBM, DOLBY, and FLAC file types{' '}
        </TextIcon>
      </Grid>
      <Grid item xs={6} md={4}>
        <TextIcon Icon={DarkModeIcon} title="Dark Mode">
          Can toggle light/dark mode
        </TextIcon>
      </Grid>
    </Grid>
  );
};

export default FeatureIcons;
