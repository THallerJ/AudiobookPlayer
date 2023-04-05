import { Typography, useTheme } from '@mui/material';
import BackToolBar from '../misc/BackToolbar';

const LoginFailed = () => {
  const theme = useTheme();

  const content = (
    <Typography sx={{ pt: theme.spacing(2), pl: theme.spacing(2) }}>
      Login failed. Please try again.
    </Typography>
  );

  return <BackToolBar title="Login Failed" content={content} />;
};

export default LoginFailed;
