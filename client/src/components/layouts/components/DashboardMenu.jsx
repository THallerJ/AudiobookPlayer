import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGoogle } from '../../../contexts/GoogleContext/GoogleContext';
import { useDashboard } from '../../../contexts/DashboardContext/DashboardContext';
import { useMediaPlayer } from '../../../contexts/MediaPlayerContext/MediaPlayerContext';
import { useApp } from '../../../contexts/AppContext/AppContext';
import useLogout from '../../../hooks/useLogout';

const DashboardMenu = () => {
  const navigate = useNavigate();
  const { toggleDarkMode, setAuthentication } = useApp();

  const {
    refreshLibrary,
    currentBook,
    setPlayingBook,
    setCurrentBook,
    setPlayingChapter,
  } = useGoogle();

  const {
    anchorEl,
    setAnchorEl,
    setOpenFolderDialog,
    showTrackController,
    setOpenCoverDialog,
  } = useDashboard();

  const { setSound } = useMediaPlayer();

  const logout = useLogout(
    setAuthentication,
    setSound,
    setPlayingChapter,
    setPlayingBook,
    setCurrentBook
  );

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpenFolderDialog(true);
    handleCloseMenu();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      {!showTrackController && (
        <MenuItem onClick={handleOpen}>Set Drive Directory</MenuItem>
      )}
      {!showTrackController && (
        <MenuItem
          onClick={() => {
            refreshLibrary();
            handleCloseMenu();
          }}
        >
          Refresh Library
        </MenuItem>
      )}
      {currentBook && !showTrackController && (
        <MenuItem
          onClick={() => {
            setOpenCoverDialog(true);
            handleCloseMenu();
          }}
        >
          Change Book Cover
        </MenuItem>
      )}
      <MenuItem
        onClick={() => {
          toggleDarkMode();
          handleCloseMenu();
        }}
      >
        Toggle Dark Mode
      </MenuItem>

      <MenuItem
        onClick={() => {
          navigate('/appinfo');
          handleCloseMenu();
        }}
      >
        App Information
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate('/privacypolicy');
          handleCloseMenu();
        }}
      >
        Privacy Policy
      </MenuItem>
      <MenuItem
        onClick={() => {
          logout();
          handleCloseMenu();
        }}
      >
        Log Out
      </MenuItem>
    </Menu>
  );
};

export default DashboardMenu;
