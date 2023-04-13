import { Divider, List, Box, useTheme } from '@mui/material';
import LabelListItem from '../misc/LabelListItem';
import BaseDialog from './components/BaseDialog';
import MockLibrary from './components/MockLibrary';

const TutorialDialog = ({ open, setOpen }) => {
  const theme = useTheme();

  const content = (
    <List>
      <LabelListItem
        text="Your audiobook library on Google Drive must be organized in the
				following manner:"
      />
      <Divider sx={{ mt: theme.spacing(2), mb: theme.spacing(1) }} />
      <Box display="flex" justifyContent="center" sx={{ p: theme.spacing(1) }}>
        <MockLibrary />
      </Box>
      <Divider sx={{ mt: theme.spacing(1), mb: theme.spacing(2) }} />
      <LabelListItem
        text='The Google Drive folder containing your audiobook library must be
				accessible to "Anyone with the link".'
      />
      <LabelListItem
        text="Audio files must be in one of the following formats: MP3, MPEG,
			OPUS, OGG, OGA, WAV, AAC, CAF, M4A, MP4, WEBA, WEBM, DOLBY, or FLAC."
      />
      <LabelListItem
        text="Many audiobooks are in the M4B format, which is not supported.
			However, M4B files can be converted to M4A by simply renaming the
			file with the .m4a file extension."
      />
    </List>
  );

  return (
    <BaseDialog
      title="Tutorial"
      content={content}
      open={open}
      setOpen={setOpen}
      ok={() => setOpen(false)}
    />
  );
};

export default TutorialDialog;
