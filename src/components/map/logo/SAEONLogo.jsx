import { Box } from '@mui/material';

const SAEONLogo = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 10,
      right: 10,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '6px 14px',
      borderRadius: '6px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      zIndex: 1000,
      gap: 2,
    }}
  >
    <Box
      component="img"
      src="/assets/saeon_logo.png"
      alt="SAEON Logo"
      sx={{
        height: 40,
        maxWidth: 100,
        objectFit: 'contain',
      }}
    />
    <Box
      component="img"
      src="/assets/zindi.png"
      alt="zindi Logo"
      sx={{
        height: 40,
        maxWidth: 100,
        objectFit: 'contain',
      }}
    />
  </Box>
);

export default SAEONLogo;
