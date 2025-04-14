import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { getDateRange, getAllDates, getAirQualityByDate } from '@/api/airQuality';
import SAEONLogo from '@/components/map/logo/SAEONLogo';
import TimeSlider from '@/components/map/TimeSlider';
import LayerControl from '@/components/map/LayerControl';
import AirQualityLayer from '@/components/map/AirQualityLayer';
import Sidebar from '@/components/map/Sidebar';
import InfoControl from '@/components/map/InfoControl';
import 'leaflet/dist/leaflet.css';
import { getPM25ColorScale, getAQILevels, getPopulationDensityLevels } from '@/utils/colorScale';

const logger = {
  info: (message) => {
    if (import.meta.env.DEV) {
      console.info(`[MapView] ${message}`);
    }
  },
  error: (message, error) => {
    // Always log errors
    console.error(`[MapView] ${message}`, error);
  },
};

const availableLayers = [
  { id: 'airQuality', label: 'Air Quality (PM2.5)' },
  { id: 'population', label: 'Population Density' },
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
  const [infoOpen, setInfoOpen] = useState(false);
  const [timeSliderPlaying, setTimeSliderPlaying] = useState(false);

  const { data: dateRange, isLoading: isLoadingDateRange } = useQuery({
    queryKey: ['dateRange'],
    queryFn: getDateRange,
  });

  const { data: datesData, isLoading: isLoadingDates } = useQuery({
    queryKey: ['dates'],
    queryFn: getAllDates,
    enabled: !!dateRange,
  });

  useEffect(() => {
    if (datesData?.dates && datesData.dates.length > 0) {
      setDates(datesData.dates);

      if (!selectedDate) {
        const firstDate = datesData.dates[0].split('T')[0];
        logger.info(`Setting initial date: ${firstDate}`);
        setSelectedDate(firstDate);
      }
    }
  }, [datesData, selectedDate]);

  const { data: airQualityData, isLoading: isLoadingAirQuality } = useQuery({
    queryKey: ['airQualityByDate', selectedDate],
    queryFn: getAirQualityByDate,
    enabled: !!selectedDate,
    onSuccess: (data) => {
      if (!data || !data.data || data.data.length === 0) {
        logger.info(`No data found for date: ${selectedDate}, trying next date...`);

        if (dates.length > dateIndex + 1) {
          const nextIndex = dateIndex + 1;
          const nextDate = dates[nextIndex].split('T')[0];
          logger.info(`Trying next date: ${nextDate}`);
          setDateIndex(nextIndex);
          setSelectedDate(nextDate);
        }
      } else {
        logger.info(`Found data for date: ${selectedDate}, data points: ${data.data.length}`);
      }
    },
  });

  const filteredData = useMemo(() => {
    if (!airQualityData?.data) return [];

    let filtered = [...airQualityData.data];

    if (filters.cities.length > 0) {
      filtered = filtered.filter((item) => filters.cities.includes(item.city));
    }

    filtered = filtered.filter(
      (item) =>
        item.predicted_pm25 >= filters.pm25Range[0] && item.predicted_pm25 <= filters.pm25Range[1],
    );

    filtered = filtered.filter(
      (item) =>
        item.pop_density_2010 >= filters.densityRange[0] &&
        item.pop_density_2010 <= filters.densityRange[1],
    );

    return filtered;
  }, [airQualityData?.data, filters.cities, filters.pm25Range, filters.densityRange]);

  const handleDateChange = (date) => {
    const formattedDate = date.split('T')[0];

    const index = dates.findIndex((d) => d.split('T')[0] === formattedDate);
    if (index !== -1) {
      setDateIndex(index);
    }
    setSelectedDate(formattedDate);
  };

  const handleLayerToggle = (layerId) => {
    setActiveLayers((prev) => {
      if (prev.includes(layerId)) {
        return prev.filter((id) => id !== layerId);
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
        densityRange: [0, 20000],
      });
    } else {
      setFilters((prev) => ({
        ...prev,
        [filter.type]: filter.value,
      }));
    }
  };

  // Handle info panel toggling
  const handleInfoToggle = (isOpen) => {
    setInfoOpen(isOpen);

    // If info panel is opening and time slider is playing, save state and pause it
    if (isOpen && timeSliderPlaying) {
      setTimeSliderPlaying(false);
    }
  };

  // Handle time slider play/pause state
  const handleTimeSliderPlayingChange = (isPlaying) => {
    setTimeSliderPlaying(isPlaying);
  };

  const colorScale = getPM25ColorScale();

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

  const noDataToDisplay =
    airQualityData && (!airQualityData.data || airQualityData.data.length === 0);

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

        <InfoControl position="bottomleft" onInfoToggle={handleInfoToggle} />
      </MapContainer>

      <Sidebar onFilterChange={handleFilterChange} />

      <LayerControl
        layers={availableLayers}
        activeLayers={activeLayers}
        onLayerToggle={handleLayerToggle}
      />

      {isLoadingAirQuality && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            p: 2,
            borderRadius: 2,
            zIndex: 1000,
          }}
        >
          <CircularProgress size={30} />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Loading data...
          </Typography>
        </Box>
      )}

      {noDataToDisplay && !isLoadingAirQuality && (
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            p: 2,
            borderRadius: 2,
            zIndex: 1000,
          }}
        >
          <Typography variant="body2">
            No air quality data available for {selectedDate}. Please select another date using the
            time slider below.
          </Typography>
        </Box>
      )}

      {/* Legends */}
      {(activeLayers.includes('airQuality') || activeLayers.includes('population')) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 100,
            right: 10,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {activeLayers.includes('airQuality') && (
            <Paper
              sx={{
                p: 1.5,
                boxShadow: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 1,
                minWidth: 250,
                maxWidth: 250,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                PM2.5 Levels (µg/m³)
              </Typography>
              {getAQILevels().map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.3 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: item.color,
                      mr: 1,
                      border: '1px solid #666',
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.value} - {item.description}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}

          {activeLayers.includes('population') && (
            <Paper
              sx={{
                p: 1.5,
                boxShadow: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 1,
                minWidth: 250,
                maxWidth: 250,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                Population Density (people/km²)
              </Typography>
              {getPopulationDensityLevels().map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.3 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: item.color,
                      mr: 1,
                      border: '1px solid #666',
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 10,
          zIndex: 1000,
          width: '150px',
        }}
      >
        <SAEONLogo />
      </Box>

      {/* Pass the infoOpen state to TimeSlider to prevent playing when info is open */}
      <TimeSlider
        dates={dates}
        selectedDate={selectedDate}
        onChange={handleDateChange}
        infoOpen={infoOpen}
        onPlayingChange={handleTimeSliderPlayingChange}
      />
    </Box>
  );
}

export default MapView;
