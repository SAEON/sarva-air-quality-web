import { Box, Typography, Paper } from '@mui/material';

function Legend({ title, colorScale, min, max, steps = 5 }) {
  const range = max - min;
  const stepSize = range / steps;
  
  const items = Array.from({ length: steps }, (_, i) => {
    const value = min + i * stepSize;
    return {
      value: value.toFixed(1),
      color: colorScale(value)
    };
  });
  
  items.push({
    value: max.toFixed(1),
    color: colorScale(max)
  });

  return (
    <Paper sx={{ 
      position: 'absolute', 
      bottom: 100, 
      right: 10,
      zIndex: 1000,
      p: 2,
      boxShadow: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    }}>
      <Typography variant="subtitle2" gutterBottom>{title}</Typography>
      {items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box 
            sx={{ 
              width: 20, 
              height: 20, 
              backgroundColor: item.color, 
              mr: 1,
              border: '1px solid #666'
            }} 
          />
          <Typography variant="caption">{item.value}</Typography>
        </Box>
      ))}
    </Paper>
  );
}

export default Legend;