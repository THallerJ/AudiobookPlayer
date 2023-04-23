import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  drawer: {
    width: 240,
  },
  scrollbar: {
    width: 12,
    smallWidth: 4,
  },
  palette: {
    mode: 'light',
    scrollbar: {
      thumb: '#8e8e93',
      thumbAlt: '#c7c7cc',
    },
    primary: {
      main: '#9780EA',
    },
    primaryAlt: {
      main: '#FFC8C8',
    },
    secondary: {
      light: '#b1b1b1',
      main: '#9e9e9e',
      dark: '#6e6e6e',
      contrastText: '#000',
    },
    background: {
      default: '#F2F2F7FF',
      paper: '#FFFFFFFF',
      alt: '#F2F2F7FF',
      container: '#FFFFFFFF',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: 'white',
          color: 'black',
        },
      },
    },
  },
});

export default lightTheme;
