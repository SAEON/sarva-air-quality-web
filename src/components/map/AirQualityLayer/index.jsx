import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getPopulationDensityScale } from '@/utils/colorScale';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const logger = {
  info: (message) => {
    if (import.meta.env.DEV) {
      console.info(`[AirQualityLayer] ${message}`);
    }
  },
  error: (message, error, data) => {
    // Always log errors
    console.error(`[AirQualityLayer] ${message}`, error, data);
  },
};

function AirQualityLayer({ data, colorScale, visualizationType = 'airQuality' }) {
  const map = useMap();

  useEffect(() => {
    if (!data || data.length === 0) {
      logger.info('No data to display in Air Quality Layer');
      return;
    }

    logger.info(`Creating markers for ${data.length} data points, type: ${visualizationType}`);

    const markerClusterGroup = L.markerClusterGroup({
      disableClusteringAtZoom: 10,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 50,
    });

    data.forEach((point) => {
      if (!point.geometry) return;

      try {
        const geom =
          typeof point.geometry === 'string' ? JSON.parse(point.geometry) : point.geometry;

        if (!geom || !geom.coordinates) return;

        const [lng, lat] = geom.coordinates;

        let color, value, radius;

        if (visualizationType === 'airQuality') {
          value = point.predicted_pm25;
          color = colorScale(value);
          radius = Math.min(3 + value / 10, 15);
        } else if (visualizationType === 'population') {
          value = point.pop_density_2010;
          color = getPopulationDensityScale()(value);

          radius = Math.min(5 + value / 1000, 15);
        }

        const circleMarker = L.circleMarker([lat, lng], {
          radius,
          fillColor: color,
          color: '#333',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        });

        let popupContent;
        if (visualizationType === 'airQuality') {
          popupContent = `
            <strong>${point.city}</strong><br>
            Date: ${new Date(point.observation_date).toLocaleDateString()}<br>
            PM2.5: ${point.predicted_pm25.toFixed(2)} µg/m³<br>
            Population Density: ${point.pop_density_2010.toFixed(2)} people/km²
          `;
        } else {
          popupContent = `
            <strong>${point.city}</strong><br>
            Date: ${new Date(point.observation_date).toLocaleDateString()}<br>
            Population Density: ${point.pop_density_2010.toFixed(2)} people/km²<br>
            PM2.5: ${point.predicted_pm25.toFixed(2)} µg/m³
          `;
        }

        circleMarker.bindPopup(popupContent);
        markerClusterGroup.addLayer(circleMarker);
      } catch (error) {
        logger.error('Error creating marker:', error, point);
      }
    });

    map.addLayer(markerClusterGroup);

    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, data, colorScale, visualizationType]);

  return null;
}

export default AirQualityLayer;
