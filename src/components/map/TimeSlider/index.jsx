// src/components/map/TimeSlider/index.jsx
import { useState, useEffect, useRef } from 'react';
import { Box, Slider, Typography, Button } from '@mui/material';
import { format, parseISO } from 'date-fns';

function TimeSlider({ dates, selectedDate, onChange }) {
  const [value, setValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  
  // Update slider position when selectedDate changes from parent
  useEffect(() => {
    if (selectedDate && dates.length > 0) {
      const index = dates.findIndex(d => formatDate(d) === formatDate(selectedDate));
      if (index !== -1) {
        setValue(index);
      }
    }
  }, [selectedDate, dates]);

  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isPlaying && dates.length > 0) {
      intervalRef.current = setInterval(() => {
        setValue(prev => {
          const newValue = prev >= dates.length - 1 ? 0 : prev + 1;
          const nextDate = formatDate(dates[newValue]);
          onChange(nextDate);
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, dates, onChange]);

  const handleSliderChange = (_, newValue) => {
    setValue(newValue);
    const selectedDate = formatDate(dates[newValue]);
    onChange(selectedDate);
  };

  const handlePlayToggle = () => {
    setIsPlaying(prev => !prev);
  };

  if (!dates || dates.length === 0) return null;

  return (
    <Box sx={{ 
      position: 'absolute', 
      bottom: 20, 
      left: '50%', 
      transform: 'translateX(-50%)',
      width: '80%',
      maxWidth: 800,
      bgcolor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: 2,
      p: 2,
      zIndex: 1000,
      boxShadow: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {selectedDate ? format(parseISO(formatDate(selectedDate)), 'MMM d, yyyy') : ''}
        </Typography>
        <Button 
          onClick={handlePlayToggle} 
          size="small" 
          variant="contained"
          color={isPlaying ? "error" : "primary"}
          sx={{ minWidth: '60px' }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </Box>
      <Slider
        value={value}
        onChange={handleSliderChange}
        min={0}
        max={dates.length - 1}
        step={1}
        marks={dates.length >= 2 ? [
          { value: 0, label: format(parseISO(formatDate(dates[0])), 'MMM yyyy') },
          { value: dates.length - 1, label: format(parseISO(formatDate(dates[dates.length - 1])), 'MMM yyyy') }
        ] : []}
      />
    </Box>
  );
}

export default TimeSlider;