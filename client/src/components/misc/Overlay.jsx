import { Typography, Box, Button, Slide, useTheme } from '@mui/material';

const Overlay = ({
  variant,
  showOverlay,
  text,
  icon,
  anchor,
  onClick,
  transparency,
}) => {
  const theme = useTheme();

  const renderVariant = () => {
    switch (variant) {
      case 'fullSize':
        return (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              width: '100%',
              height: '100%',
              bgcolor: `rgba(0, 0, 0,${transparency || '0.75'})`,
              color: 'white',
              padding: '15px',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon || <Typography variant="caption">{text}</Typography>}
          </Box>
        );
      case 'border':
        return (
          <Box
            sx={{
              position: 'absolute',
              bgcolor: `rgb(0, 0, 0, ${transparency || '0.35'})`,
              bottom: 0,
              width: '100%',
              height: '100%',
              color: 'white',
              border: `4px solid ${theme.palette.primary.main}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon && icon}
          </Box>
        );
      case 'button':
        return (
          <Box
            sx={{
              position: 'absolute',
              bottom: anchor === 'bottom' ? 0 : null,
              top: anchor !== 'bottom' ? 0 : null,
              width: '100%',
            }}
          >
            <Button
              fullWidth
              size="small"
              variant="contained"
              aria-label="resume"
              onClick={onClick}
            >
              {text}
            </Button>
          </Box>
        );
      default:
        return (
          <Slide direction={anchor === 'top' ? 'down' : 'up'} in={showOverlay}>
            <Box
              sx={{
                position: 'absolute',
                bottom: anchor === 'bottom' ? 0 : null,
                top: anchor === 'bottom' ? null : 0,
                width: '100%',
                bgcolor: `rgba(0, 0, 0, ${transparency || '0.75'})`,
                color: 'white',
                padding: '15px',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon || (
                <Typography noWrap variant="caption">
                  {text}
                </Typography>
              )}
            </Box>
          </Slide>
        );
    }
  };

  return showOverlay ? renderVariant() : null;
};

export default Overlay;
