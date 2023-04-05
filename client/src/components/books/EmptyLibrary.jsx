import { useState, Suspense, lazy } from 'react';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  styled,
} from '@mui/material';
import { useDashboard } from '../../contexts/DashboardContext/DashboardContext';
import { useGoogle } from '../../contexts/GoogleContext/GoogleContext';
import { useApp } from '../../contexts/AppContext/AppContext';
import CenterWrapper from '../styled_components/CenterWrapper';

const TutorialDialog = lazy(() => import('../dialogs/TutorialDialog'));

const EmptyLibrary = () => {
  const { googleDirectoryExists } = useApp();
  const { setOpenFolderDialog } = useDashboard();
  const { isLoadingLibrary } = useGoogle();
  const [openTutorialDialog, setOpenTutorialDialog] = useState(false);

  const renderBody = () => {
    if (isLoadingLibrary) {
      return (
        <CenterWrapper>
          <CircularProgress />
        </CenterWrapper>
      );
    }

    if (googleDirectoryExists) {
      return (
        <Typography>
          Your library either doesn&apos;t have any books, or your library is
          not organized properly.
        </Typography>
      );
    }

    return (
      <div>
        <Typography align="center">
          You must select where your where your audiobook library is located on
          Google Drive.
        </Typography>
        <Box className="btnContainer">
          <Button
            onClick={() => setOpenFolderDialog(true)}
            aria-label="Set drive directory"
          >
            Set Drive Directory
          </Button>
          <Button
            onClick={() => setOpenTutorialDialog(true)}
            aria-label="Tutorial"
          >
            Tutorial
          </Button>
        </Box>
        <Suspense fallback={null}>
          <TutorialDialog
            open={openTutorialDialog}
            setOpen={setOpenTutorialDialog}
          />
        </Suspense>
      </div>
    );
  };

  return (
    <StyledContainer>
      <CenterWrapper>{renderBody()}</CenterWrapper>
    </StyledContainer>
  );
};

export default EmptyLibrary;

// Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
  height: '60vh',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  '.btnContainer': {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(1),
  },
}));
