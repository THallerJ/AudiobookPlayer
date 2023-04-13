import {
  Typography,
  Hidden,
  IconButton,
  AppBar,
  Toolbar,
  LinearProgress,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVert from '@mui/icons-material/MoreVert';
import { useGoogle } from '../../../contexts/GoogleContext/GoogleContext';
import { useDashboard } from '../../../contexts/DashboardContext/DashboardContext';

const DashboardAppBar = () => {
  const theme = useTheme();
  const { setAnchorEl, setOpenDrawer } = useDashboard();
  const { isRefreshingLibrary } = useGoogle();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Hidden mdDown>
        <AppBar
          sx={{ width: `calc(100% - ${theme.drawer.width}px)` }}
          position="fixed"
        >
          <Toolbar>
            <Typography noWrap variant="h6">
              Stream Audiobook Player
            </Typography>
            <IconButton
              edge="end"
              sx={{ marginLeft: 'auto' }}
              onClick={handleOpenMenu}
              aria-label="menu"
            >
              <MoreVert />
            </IconButton>
          </Toolbar>
          {isRefreshingLibrary ? (
            <LinearProgress sx={{ zIndex: 1101 }} />
          ) : null}
        </AppBar>
      </Hidden>
      <Hidden mdUp>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              aria-label="Toggle drawer"
              onClick={() => setOpenDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography noWrap variant="h6">
              Stream Audiobook Player
            </Typography>
            <IconButton
              edge="end"
              sx={{ marginLeft: 'auto' }}
              onClick={handleOpenMenu}
              aria-label="menu"
            >
              <MoreVert />
            </IconButton>
          </Toolbar>
          {isRefreshingLibrary ? (
            <LinearProgress sx={{ zIndex: 1101 }} />
          ) : null}
        </AppBar>
      </Hidden>
    </>
  );
};

export default DashboardAppBar;
