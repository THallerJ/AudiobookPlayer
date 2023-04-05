import { Typography, List, Link, Divider } from '@mui/material';
import LabelListItem from '../../misc/LabelListItem';
import DisplayText from '../../misc/DisplayText';

const AppInfo = () => {
  const content = (
    <div>
      <Typography variant="h5">About</Typography>
      <Typography variant="body1">
        Stream Audiobook Player is a web app that allows users to stream DRM
        free audiobooks that are stored on their Google Drive.
      </Typography>
      <Divider />

      <Typography variant="h5">Features</Typography>
      <List>
        <LabelListItem text="Adjustable playback speed (0.5x to 4x speed)" />
        <LabelListItem text="Light/dark mode" />
        <LabelListItem text="Progress syncs across devices" />
        <LabelListItem text="Book covers are automatically found and displayed" />
        <LabelListItem text="Mobile and desktop friendly UI (built with Material UI)" />
        <LabelListItem text="Supports MP3, MPEG, OPUS, OGG, OGA, WAV, AAC, CAF, M4A, MP4, WEBA, WEBM, DOLBY, and FLAC file types." />
      </List>
      <Divider />
      <Typography variant="h5">Privacy Policy</Typography>
      <Typography variant="body1">
        Read the{' '}
        <Link underline="hover" href="/privacypolicy">
          privacy policy
        </Link>{' '}
        for more information about how the app uses your data.
      </Typography>
    </div>
  );

  return <DisplayText title="App Information" content={content} />;
};

export default AppInfo;
