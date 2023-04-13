import { Suspense, lazy } from 'react';
import { Box, styled } from '@mui/material';
import Div100vh from 'react-div-100vh';
import DashboardBody from './components/DashboardBody';
import { useDashboard } from '../../contexts/DashboardContext/DashboardContext';
import Sidebar from './Sidebar';
import useIsLargeScreen from '../../hooks/useIsLargeScreen';
import DashboardMenu from './components/DashboardMenu';
import DashboardAppBar from './components/DashboardAppBar';

const FolderSelectDialog = lazy(() => import('../dialogs/FolderSelectDialog'));
const ChangeCoverDialog = lazy(() => import('../dialogs/ChangeCoverDialog'));

const Dashboard = () => {
  const {
    openFolderDialog,
    setOpenFolderDialog,
    openCoverDialog,
    setOpenCoverDialog,
  } = useDashboard();
  const isLargeScreen = useIsLargeScreen();

  return (
    <Div100vh>
      <StyledDashboardContainer>
        <Sidebar />
        <DashboardAppBar />
        <div className={isLargeScreen ? 'bodyRight' : 'body'}>
          <DashboardBody />
        </div>
        <DashboardMenu />
        <Suspense fallback={null}>
          {openFolderDialog && (
            <FolderSelectDialog
              open={openFolderDialog}
              setOpen={setOpenFolderDialog}
            />
          )}
        </Suspense>
        <Suspense fallback={null}>
          {openCoverDialog && (
            <ChangeCoverDialog
              open={openCoverDialog}
              setOpen={setOpenCoverDialog}
            />
          )}
        </Suspense>
      </StyledDashboardContainer>
    </Div100vh>
  );
};

export default Dashboard;

// Styled Components
const StyledDashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  width: '100%',
  overflow: 'hidden',

  '.body': {
    paddingTop: theme.mixins.toolbar.minHeight,
    width: '100%',
    height: '100%',
  },

  '.bodyRight': {
    paddingTop: theme.mixins.toolbar.minHeight,
    marginLeft: theme.drawer.width,
    width: '100%',
    height: '100%',
  },
}));
