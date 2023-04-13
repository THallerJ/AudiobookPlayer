import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGoogle } from '../../../contexts/GoogleContext/GoogleContext';
import { useDashboard } from '../../../contexts/DashboardContext/DashboardContext';
import { useApp } from '../../../contexts/AppContext/AppContext';

const DashboardMenu = () => {
  const navigate = useNavigate();
  const { toggleDarkMode } = useApp();
  const { refreshLibrary, logout, currentBook } = useGoogle();
  const {
    anchorEl,
    setAnchorEl,
    setOpenFolderDialog,
    showTrackController,
    setOpenCoverDialog,
  } = useDashboard();

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
