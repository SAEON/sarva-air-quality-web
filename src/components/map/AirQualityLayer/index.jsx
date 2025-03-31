// src/components/map/AirQualityLayer/index.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

function AirQualityLayer({ data, colorScale, visualizationType = 'airQuality' }) {
  const map = useMap();
  
  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No data to display in AirQualityLayer");
      return;
    }
    
    console.log(`Creating markers for ${data.length} data points, type: ${visualizationType}`);
    
    // Create a marker cluster group
    const markerClusterGroup = L.markerClusterGroup({
      disableClusteringAtZoom: 10,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 50
    });

    // Add markers for each data point
    data.forEach(point => {
      if (!point.geometry) return;
      
      try {
        const geom = typeof point.geometry === 'string' 
          ? JSON.parse(point.geometry) 
          : point.geometry;
        
        if (!geom || !geom.coordinates) return;
        
        const [lng, lat] = geom.coordinates;
        
        // Determine color based on visualization type
        let color, value, radius;
        
        if (visualizationType === 'airQuality') {
          value = point.predicted_pm25;
          color = colorScale(value);
          radius = 8;
        } else if (visualizationType === 'population') {
          // Population density coloring
          value = point.pop_density_2010;
          // Population density color scale - from yellow (low) to red (high)
          const densityScale = (value) => {
            if (value < 100) return '#FFEDA0';
            if (value < 500) return '#FED976';
            if (value < 1000) return '#FEB24C';
            if (value < 5000) return '#FD8D3C';
            if (value < 10000) return '#FC4E2A';
            if (value < 20000) return '#E31A1C';
            return '#BD0026';
          };
          color = densityScale(value);
          // Adjust radius based on population density
          radius = Math.min(5 + (value / 1000), 15);
        }
        
        const circleMarker = L.circleMarker([lat, lng], {
          radius: radius,
          fillColor: color,
          color: '#333',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });

        // Build popup content based on visualization type
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
        console.error('Error creating marker:', error, point);
      }
    });

    // Add the marker cluster group to the map
    map.addLayer(markerClusterGroup);

    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, data, colorScale, visualizationType]);

  return null;
}

export default AirQualityLayer;