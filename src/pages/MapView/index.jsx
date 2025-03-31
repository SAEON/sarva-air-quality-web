import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { getDateRange, getAllDates, getAirQualityByDate } from '@/api/airQuality';
import TimeSlider from '@/components/map/TimeSlider';
import LayerControl from '@/components/map/LayerControl';
import AirQualityLayer from '@/components/map/AirQualityLayer';
import Sidebar from '@/components/map/Sidebar';
import { getPM25ColorScale } from '@/utils/colorScale';
import 'leaflet/dist/leaflet.css';

const availableLayers = [
  { id: 'airQuality', label: 'Air Quality (PM2.5)' },
  { id: 'population', label: 'Population Density' }
];

function MapView() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const [activeLayers, setActiveLayers] = useState(['airQuality']);
  const [dateIndex, setDateIndex] = useState(0);
  const [filters, setFilters] = useState({
    cities: [],
    pm25Range: [0, 300],
    densityRange: [0, 20000],
  });
  
  // Get date range first
  const { data: dateRange, isLoading: isLoadingDateRange } = useQuery({
    queryKey: ['dateRange'],
    queryFn: getDateRange
  });

  // Get all dates
  const { data: datesData, isLoading: isLoadingDates } = useQuery({
    queryKey: ['dates'],
    queryFn: getAllDates,
    enabled: !!dateRange
  });

  // Set initial dates when dates are loaded
  useEffect(() => {
    if (datesData?.dates && datesData.dates.length > 0) {
      setDates(datesData.dates);
      
      // Try the first date
      if (!selectedDate) {
        const firstDate = datesData.dates[0].split('T')[0];
        console.log("Setting initial date:", firstDate);
        setSelectedDate(firstDate);
      }
    }
  }, [datesData, selectedDate]);

  // Fetch data for selected date
  const { data: airQualityData, isLoading: isLoadingAirQuality } = useQuery({
    queryKey: ['airQualityByDate', selectedDate],
    queryFn: getAirQualityByDate,
    enabled: !!selectedDate,
    onSuccess: (data) => {
      // Check if we have valid data
      if (!data || !data.data || data.data.length === 0) {
        console.log(`No data found for date: ${selectedDate}, trying next date...`);
        
        // Try the next date if available
        if (dates.length > dateIndex + 1) {
          const nextIndex = dateIndex + 1;
          const nextDate = dates[nextIndex].split('T')[0];
          console.log(`Trying next date: ${nextDate}`);
          setDateIndex(nextIndex);
          setSelectedDate(nextDate);
        }
      } else {
        console.log(`Found data for date: ${selectedDate}, data points: ${data.data.length}`);
      }
    }
  });

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    if (!airQualityData?.data) return [];
    
    let filtered = [...airQualityData.data];
    
    // Apply city filter if any cities are selected
    if (filters.cities.length > 0) {
      filtered = filtered.filter(item => 
        filters.cities.includes(item.city)
      );
    }

    // Apply PM2.5 range filter
    filtered = filtered.filter(item => 
      item.predicted_pm25 >= filters.pm25Range[0] && 
      item.predicted_pm25 <= filters.pm25Range[1]
    );

    filtered = filtered.filter(item => 
      item.pop_density_2010 >= filters.densityRange[0] && 
      item.pop_density_2010 <= filters.densityRange[1]
    );
    
    return filtered;
  }, [airQualityData?.data, filters.cities, filters.pm25Range, filters.densityRange]);

  const handleDateChange = (date) => {
    const formattedDate = date.split('T')[0];
    // Find the index of this date in our dates array
    const index = dates.findIndex(d => d.split('T')[0] === formattedDate);
    if (index !== -1) {
      setDateIndex(index);
    }
    setSelectedDate(formattedDate);
  };

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      if (prev.includes(layerId)) {
        return prev.filter(id => id !== layerId);
      } else {
        return [...prev, layerId];
      }
    });
  };

  
  const handleFilterChange = (filter) => {
    if (filter.type === 'clearAll') {
      setFilters({
        cities: [],
        pm25Range: [0, 300],
        densityRange: [0, 20000]
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filter.type]: filter.value
      }));
    }
  };

  const colorScale = getPM25ColorScale();

  // Show loading state
  if (isLoadingDateRange || isLoadingDates || !selectedDate) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading map data...
        </Typography>
      </Box>
    );
  }

  // If we have an error or no data for this date
  const noDataToDisplay = 
    airQualityData && 
    (!airQualityData.data || airQualityData.data.length === 0);

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={[0, 20]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {filteredData.length > 0 && (
          <>
            {activeLayers.includes('airQuality') && (
              <AirQualityLayer 
                data={filteredData} 
                colorScale={colorScale}
                visualizationType="airQuality"
              />
            )}
            
            {activeLayers.includes('population') && (
              <AirQualityLayer 
                data={filteredData} 
                colorScale={colorScale}
                visualizationType="population"
              />
            )}
          </>
        )}
      </MapContainer>
      
      <Sidebar onFilterChange={handleFilterChange} />
      
      <LayerControl 
        layers={availableLayers}
        activeLayers={activeLayers}
        onLayerToggle={handleLayerToggle}
      />
      
      {isLoadingAirQuality && (
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          p: 2,
          borderRadius: 2,
          zIndex: 1000
        }}>
          <CircularProgress size={30} />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Loading data...
          </Typography>
        </Box>
      )}
      
      {noDataToDisplay && !isLoadingAirQuality && (
        <Box sx={{ 
          position: 'absolute', 
          top: '10%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          p: 2,
          borderRadius: 2,
          zIndex: 1000
        }}>
          <Typography variant="body2">
            No air quality data available for {selectedDate}.
            Please select another date using the time slider below.
          </Typography>
        </Box>
      )}
      
      {/* Legends */}
      {(activeLayers.includes('airQuality') || activeLayers.includes('population')) && (
        <Box sx={{ 
          position: 'absolute', 
          bottom: 100, 
          right: 10,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {activeLayers.includes('airQuality') && (
            <Paper sx={{ 
              p: 1.5, 
              boxShadow: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 1,
              minWidth: 250,
              maxWidth: 250 
            }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                PM2.5 Levels (µg/m³)
              </Typography>
              {[
                { value: '0-50', color: '#00E400', description: 'Good' },
                { value: '51-100', color: '#FFFF00', description: 'Moderate' },
                { value: '101-150', color: '#FF7E00', description: 'Unhealthy for Sensitive Groups' },
                { value: '151-200', color: '#FF0000', description: 'Unhealthy' },
                { value: '201-300', color: '#8F3F97', description: 'Very Unhealthy' },
                { value: '> 300', color: '#7E0023', description: 'Hazardous' }
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.3 }}>
                  <Box 
                    sx={{ 
                      width: 16, 
                      height: 16, 
                      backgroundColor: item.color, 
                      mr: 1,
                      border: '1px solid #666',
                      flexShrink: 0
                    }} 
                  />
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.value} - {item.description}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}
          
          {activeLayers.includes('population') && (
            <Paper sx={{ 
              p: 1.5, 
              boxShadow: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 1,
              minWidth: 250,
              maxWidth: 250
            }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                Population Density (people/km²)
              </Typography>
              {[
                { value: '< 100', color: '#FFEDA0' },
                { value: '100-500', color: '#FED976' },
                { value: '500-1000', color: '#FEB24C' },
                { value: '1000-5000', color: '#FD8D3C' },
                { value: '5000-10000', color: '#FC4E2A' },
                { value: '10000-20000', color: '#E31A1C' },
                { value: '> 20000', color: '#BD0026' }
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.3 }}>
                  <Box 
                    sx={{ 
                      width: 16, 
                      height: 16, 
                      backgroundColor: item.color, 
                      mr: 1,
                      border: '1px solid #666',
                      flexShrink: 0
                    }} 
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{item.value}</Typography>
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      )}
      
      <TimeSlider 
        dates={dates} 
        selectedDate={selectedDate}
        onChange={handleDateChange}
      />
    </Box>
  );
}

export default MapView;