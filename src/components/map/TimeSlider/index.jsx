import { useState, useEffect, useRef } from 'react';
import { Box, Slider, Typography, Button } from '@mui/material';
import { format, parseISO } from 'date-fns';

function TimeSlider({ dates, selectedDate, onChange, infoOpen = false, onPlayingChange }) {
  const [value, setValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const prevPlayingState = useRef(false);
  const valueRef = useRef(0);

  useEffect(() => {
    if (selectedDate && dates.length > 0) {
      const index = dates.findIndex((d) => formatDate(d) === formatDate(selectedDate));
      if (index !== -1) {
        valueRef.current = index;
        setValue(index);
      }
    }
  }, [selectedDate, dates]);

  // Handle info panel opening/closing
  useEffect(() => {
    if (infoOpen && isPlaying) {
      // Info panel opened while playing - save state and pause
      prevPlayingState.current = true;
      setIsPlaying(false);
    } else if (!infoOpen && prevPlayingState.current) {
      // Info panel closed and was playing before - resume playing
      setIsPlaying(true);
      prevPlayingState.current = false;
    }
  }, [infoOpen, isPlaying]);

  const formatDate = (dateString) => dateString.split('T')[0];

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && dates.length > 0) {
      intervalRef.current = setInterval(() => {
        const newValue = valueRef.current >= dates.length - 1 ? 0 : valueRef.current + 1;
        valueRef.current = newValue;
        setValue(newValue);
        onChange(formatDate(dates[newValue]));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, dates, onChange]);

  useEffect(() => {
    if (onPlayingChange) {
      onPlayingChange(isPlaying);
    }
  }, [isPlaying, onPlayingChange]);

  const handleSliderChange = (_, newValue) => {
    valueRef.current = newValue;
    setValue(newValue);
    onChange(formatDate(dates[newValue]));
  };

  const handlePlayToggle = () => {
    // Only allow play toggle when info panel is closed
    if (!infoOpen) {
      setIsPlaying((prev) => !prev);
    }
  };

  const generateTimelineMarks = () => {
    if (!dates || dates.length < 2) return [];

    const marks = [];
    const totalDates = dates.length;

    // Calculate the number of intervals based on the number of dates
    const intervals = 4;
    for (let i = 0; i <= intervals; i++) {
      const index = Math.floor((totalDates - 1) * (i / intervals));
      if (index >= 0 && index < totalDates) {
        marks.push({
          value: index,
          label: format(parseISO(formatDate(dates[index])), 'MMM yyyy'),
        });
      }
    }

    return marks;
  };

  if (!dates || dates.length === 0) return null;

  const timelineMarks = generateTimelineMarks();

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        left: '45%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: { xs: 300, sm: 500, md: 650, lg: 800 },
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        p: 1.5,
        zIndex: 1000,
        boxShadow: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            flexGrow: 1,
            color: 'text.secondary',
            fontSize: '0.95rem',
          }}
        >
          {selectedDate ? format(parseISO(formatDate(selectedDate)), 'MMMM d, yyyy') : ''}
        </Typography>
        <Button
          onClick={handlePlayToggle}
          size="small"
          variant="contained"
          color={isPlaying ? 'error' : 'primary'}
          sx={{
            minWidth: '60px',
            py: 0.5,
            fontSize: '0.8rem',
          }}
          disabled={infoOpen}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </Box>
      <Box
        sx={{
          px: 2,
          position: 'relative',
          height: 32,
        }}
      >
        {/* Vertical marker lines for month indicators */}
        {timelineMarks.map((mark, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: `calc(${(mark.value / (dates.length - 1)) * 100}% + 1px)`,
              height: '8px',
              width: '1px',
              backgroundColor: 'grey.400',
              top: '11px',
              zIndex: 1,
              transform: 'translateX(-50%)',
            }}
          />
        ))}

        <Slider
          value={value}
          onChange={handleSliderChange}
          min={0}
          max={dates.length - 1}
          step={1}
          sx={{
            color: '#1976d2',
            height: 4,
            padding: '13px 0',
            '& .MuiSlider-thumb': {
              height: 14,
              width: 14,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active': {
                boxShadow: '0 0 0 6px rgba(25, 118, 210, 0.16)',
              },
              zIndex: 2,
            },
            '& .MuiSlider-track': {
              height: 4,
              border: 'none',
            },
            '& .MuiSlider-rail': {
              height: 4,
              opacity: 0.3,
              backgroundColor: '#bdbdbd',
            },
            '& .MuiSlider-mark': {
              display: 'none',
            },
          }}
        />

        {/* Custom month labels */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            top: 21,
            left: 0,
            display: 'flex',
            justifyContent: 'space-between',
            px: 0.5,
          }}
        >
          {timelineMarks.map((mark, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                fontSize: '0.65rem',
                color: 'text.secondary',
                transform: 'translateX(-50%)',
                position: 'absolute',
                left: `${(mark.value / (dates.length - 1)) * 100}%`,
                whiteSpace: 'nowrap',
              }}
            >
              {mark.label}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default TimeSlider;
