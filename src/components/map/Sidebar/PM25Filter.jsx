// src/components/map/Sidebar/PM25Filter.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Slider, TextField, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getPM25Stats } from '@/api/airQuality';

function PM25Filter({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);
  
  // Get PM2.5 statistics to set appropriate range
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['pm25Stats'],
    queryFn: getPM25Stats
  });
  
  // Update local state when props change
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Default min/max values in case stats aren't loaded yet
  const minPM25 = statsData?.min_pm25 || 0;
  const maxPM25 = statsData?.max_pm25 || 300;
  
  const handleSliderChange = (_, newValue) => {
    setLocalValue(newValue);
  };
  
  const handleSliderChangeCommitted = (_, newValue) => {
    onChange(newValue);
  };
  
  const handleMinInputChange = (event) => {
    const newMin = Number(event.target.value);
    if (!isNaN(newMin) && newMin >= minPM25 && newMin <= localValue[1]) {
      setLocalValue([newMin, localValue[1]]);
    }
  };
  
  const handleMaxInputChange = (event) => {
    const newMax = Number(event.target.value);
    if (!isNaN(newMax) && newMax <= maxPM25 && newMax >= localValue[0]) {
      setLocalValue([localValue[0], newMax]);
    }
  };
  
  const handleInputBlur = () => {
    onChange(localValue);
  };

  // Show loading state if needed
  if (isLoading) {
    return <Typography>Loading PM2.5 data range...</Typography>;
  }

  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" gutterBottom>
          PM2.5 Range (µg/m³)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Min: {minPM25.toFixed(0)} | Max: {maxPM25.toFixed(0)}
        </Typography>
      </Box>
      
      <Slider
        value={localValue}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderChangeCommitted}
        valueLabelDisplay="auto"
        min={minPM25}
        max={maxPM25}
        sx={{ mt: 3, mb: 2 }}
      />
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Min"
            value={localValue[0]}
            onChange={handleMinInputChange}
            onBlur={handleInputBlur}
            inputProps={{
              step: 1,
              min: minPM25,
              max: localValue[1],
              type: 'number',
            }}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Max"
            value={localValue[1]}
            onChange={handleMaxInputChange}
            onBlur={handleInputBlur}
            inputProps={{
              step: 1,
              min: localValue[0],
              max: maxPM25,
              type: 'number',
            }}
            size="small"
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PM25Filter;