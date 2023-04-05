import { Grid, Typography, useTheme, IconButton } from '@mui/material';
import GoogleButton from 'react-google-button';
import DownArrow from '@mui/icons-material/KeyboardArrowDown';
import Logo from '../../../assets/icons/logo.svg';
import { useApp } from '../../../contexts/AppContext/AppContext';
import useIsLargeScreen from '../../../hooks/useIsLargeScreen';

const SignIn = ({ scroll }) => {
  const theme = useTheme();
  const { serverUrl } = useApp();
  const isLargeScreen = useIsLargeScreen();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh' }}
    >
      <Grid
        container
        item
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        spacing={theme.spacing(2)}
      >
        <Grid item>
          <img src={Logo} height="75" alt="Stream Audiobook Player logo" />
        </Grid>
        <Grid item>
          <Typography
            align="center"
            variant={isLargeScreen ? 'h3' : 'h4'}
            sx={{
              pb: theme.spacing(3),
              pr: theme.spacing(1),
              pl: theme.spacing(1),
              pt: theme.spacing(4),
            }}
          >
            Stream Audiobook Player
          </Typography>
        </Grid>

        <Grid item>
          <GoogleButton
            type="light"
            onClick={async () => {
              window.open(`${serverUrl}/auth/google`, '_self');
            }}
            aria-label="Sign in with Google"
          />
        </Grid>
        <Grid item>
          <IconButton sx={{ mt: theme.spacing(3) }} onClick={scroll}>
            <DownArrow fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignIn;
