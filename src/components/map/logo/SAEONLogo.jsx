import { Box } from '@mui/material';

const SAEONLogo = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '4px',
      borderRadius: '4px',
    }}
  >
    <img
      src="/assets/saeon_logo.png"
      alt="SAEON Logo"
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  </Box>
);

export default SAEONLogo;
