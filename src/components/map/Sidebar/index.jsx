// src/components/map/Sidebar/index.jsx
import { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Drawer, 
  Typography, 
  Divider,
  Button
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import CityFilter from './CityFilter';
import PM25Filter from './PM25Filter';
import PopulationDensityFilter from './PopulationDensityFilter';

function Sidebar({ onFilterChange }) {
  const [open, setOpen] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const [pm25Range, setPM25Range] = useState([0, 300]); // Default values
  const [densityRange, setDensityRange] = useState([0, 20000]); // Default values

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleCityChange = (cities) => {
    setSelectedCities(cities);
    onFilterChange({ 
      type: 'cities', 
      value: cities 
    });
  };
  
  const handlePM25Change = (range) => {
    setPM25Range(range);
    onFilterChange({
      type: 'pm25Range',
      value: range
    });
  };
  
  const handleDensityChange = (range) => {
    setDensityRange(range);
    onFilterChange({
      type: 'densityRange',
      value: range
    });
  };
  
  const handleClearFilters = () => {
    // Reset all filter states to defaults
    setSelectedCities([]);
    setPM25Range([0, 300]);
    setDensityRange([0, 20000]);
    
    // Notify parent component
    onFilterChange({
      type: 'clearAll',
      value: true
    });
  };

  return (
    <>
      {/* Sidebar toggle button */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          left: 10, 
          zIndex: 1000,
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: 2
        }}
      >
        <Tooltip title="Filter Options">
          <IconButton 
            onClick={toggleSidebar} 
            size="large"
            color={open ? "primary" : "default"}
          >
            <FilterAltIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Sidebar drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="persistent"
        sx={{
          width: 300,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
            top: '60px',
            height: 'calc(100% - 60px)',
            borderTopRightRadius: '8px',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Filter Options
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {/* Scrollable filter content area */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {/* City filter */}
            <Typography variant="subtitle2" gutterBottom>
              Filter by City
            </Typography>
            <CityFilter 
              selectedCities={selectedCities}
              onChange={handleCityChange}
            />
            
            <Divider sx={{ my: 2 }} />
            
            {/* PM2.5 filter */}
            <Typography variant="subtitle2" gutterBottom>
              Filter by PM2.5 Level
            </Typography>
            <PM25Filter 
              value={pm25Range}
              onChange={handlePM25Change}
            />
            
            <Divider sx={{ my: 2 }} />
            
            {/* Population density filter */}
            <Typography variant="subtitle2" gutterBottom>
              Filter by Population Density
            </Typography>
            <PopulationDensityFilter 
              value={densityRange}
              onChange={handleDensityChange}
            />
          </Box>
          
          {/* Clear filters button - fixed at bottom */}
          <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Button 
              startIcon={<ClearIcon />}
              color="error"
              fullWidth
              variant="contained"
              onClick={handleClearFilters}
              sx={{ mt: 1 }}
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;