import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  Divider,
} from '@mui/material';
import useIsLargeScreen from '../../../hooks/useIsLargeScreen';

const BaseDialog = ({
  title,
  content,
  height: dialogHeight,
  width: dialogWidth,
  headerContent,
  open,
  setOpen,
  ok,
  cancel,
}) => {
  const isLargeScreen = useIsLargeScreen();

  const renderButtons = (
    <DialogActions>
      {ok && (
        <Button aria-label="Ok" onClick={ok}>
          Ok
        </Button>
      )}
      {cancel && (
        <Button aria-label="Ok" onClick={cancel}>
          Cancel
        </Button>
      )}
    </DialogActions>
  );

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          height: dialogHeight,
          width: () => {
            if (!isLargeScreen) return '90%';
            if (dialogWidth) return dialogWidth;
            return null;
          },
        },
      }}
      sx={{ '*::-webkit-scrollbar': { width: 4 } }}
    >
      <DialogTitle>
        <div>
          <Typography align="center" variant="h6">
            {title}
          </Typography>
        </div>
        <Divider />
        {headerContent}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      {renderButtons}
    </Dialog>
  );
};

export default BaseDialog;
