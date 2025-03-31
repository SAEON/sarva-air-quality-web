// src/components/map/Sidebar/PopulationDensityFilter.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Slider, TextField, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getPopulationDensityStats } from '@/api/airQuality';

function PopulationDensityFilter({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  // Get population density statistics to set appropriate range
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['populationDensityStats'],
    queryFn: getPopulationDensityStats,
  });

  // Update local state when props change
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Default min/max values in case stats aren't loaded yet
  const minDensity = statsData?.min_density || 0;
  const maxDensity = statsData?.max_density || 20000;

  const handleSliderChange = (_, newValue) => {
    setLocalValue(newValue);
  };

  const handleSliderChangeCommitted = (_, newValue) => {
    onChange(newValue);
  };

  const handleMinInputChange = (event) => {
    const newMin = Number(event.target.value);
    if (!isNaN(newMin) && newMin >= minDensity && newMin <= localValue[1]) {
      setLocalValue([newMin, localValue[1]]);
    }
  };

  const handleMaxInputChange = (event) => {
    const newMax = Number(event.target.value);
    if (!isNaN(newMax) && newMax <= maxDensity && newMax >= localValue[0]) {
      setLocalValue([localValue[0], newMax]);
    }
  };

  const handleInputBlur = () => {
    onChange(localValue);
  };

  // Show loading state if needed
  if (isLoading) {
    return <Typography>Loading population density data range...</Typography>;
  }

  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" gutterBottom>
          Population Density (people/km²)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Min: {minDensity.toFixed(0)} | Max: {maxDensity.toFixed(0)}
        </Typography>
      </Box>

      <Slider
        value={localValue}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderChangeCommitted}
        valueLabelDisplay="auto"
        min={minDensity}
        max={maxDensity}
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
              step: 100,
              min: minDensity,
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
              step: 100,
              min: localValue[0],
              max: maxDensity,
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

export default PopulationDensityFilter;
