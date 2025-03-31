/**
 * Returns a function that maps PM2.5 levels to standard AQI colors
 * based on the EPA Air Quality Index
 * @returns {Function}
 */
export const getPM25ColorScale = () => {
  // Colors based on the EPA Air Quality Index for PM2.5
  const colors = ['#00E400', '#FFFF00', '#FF7E00', '#FF0000', '#8F3F97', '#7E0023'];
  const thresholds = [0, 51, 101, 151, 201, 301];

  return (value) => {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (value >= thresholds[i]) {
        return colors[i];
      }
    }
    return colors[0];
  };
};

/**
 * Returns a function that maps population density to colors
 * @returns {Function} A function that takes a population density value and returns a color
 */
export const getPopulationDensityScale = () => (value) => {
  if (value < 100) return '#FFEDA0';
  if (value < 500) return '#FED976';
  if (value < 1000) return '#FEB24C';
  if (value < 5000) return '#FD8D3C';
  if (value < 10000) return '#FC4E2A';
  if (value < 20000) return '#E31A1C';
  return '#BD0026';
};

/**
 * Get the AQI level description based on the PM2.5 value
 * @param {number} value - PM2.5 value in µg/m³
 * @returns {Object} Object with level name and description
 */
export const getPM25Level = (value) => {
  if (value <= 50) {
    return {
      level: 'Good',
      description: 'Quality is considered satisfactory and poses little or no risk to health',
    };
  }
  if (value <= 100) {
    return {
      level: 'Moderate',
      description:
        'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution',
    };
  }
  if (value <= 150) {
    return {
      level: 'Unhealthy for Sensitive Groups',
      description:
        'Although the general public is not likely to be affected at this AQI range, people with lung disease, older adults and children are at a greater risk from exposure to ozone, whereas persons with heart and lung disease, older adults and children are at greater risk from the presence of particles in the air',
    };
  }
  if (value <= 200) {
    return {
      level: 'Unhealthy',
      description:
        'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects',
    };
  }
  if (value <= 300) {
    return {
      level: 'Very Unhealthy',
      description: 'Health alert: everyone may experience more serious health effects',
    };
  }
  return {
    level: 'Hazardous',
    description:
      'Health warnings of emergency conditions; the entire population is more likely to be affected',
  };
};

/**
 * Get AQI levels with colors for legend display
 * @returns {Array} Array of objects with value ranges, colors, and descriptions
 */
export const getAQILevels = () => [
  { value: '0-50', color: '#00E400', description: 'Good' },
  { value: '51-100', color: '#FFFF00', description: 'Moderate' },
  { value: '101-150', color: '#FF7E00', description: 'Unhealthy for Sensitive Groups' },
  { value: '151-200', color: '#FF0000', description: 'Unhealthy' },
  { value: '201-300', color: '#8F3F97', description: 'Very Unhealthy' },
  { value: '301-500', color: '#7E0023', description: 'Hazardous' },
];

/**
 * Get population density ranges with colors for legend display
 * @returns {Array} Array of objects with value ranges and colors
 */
export const getPopulationDensityLevels = () => [
  { value: '< 100', color: '#FFEDA0' },
  { value: '100-500', color: '#FED976' },
  { value: '500-1000', color: '#FEB24C' },
  { value: '1000-5000', color: '#FD8D3C' },
  { value: '5000-10000', color: '#FC4E2A' },
  { value: '10000-20000', color: '#E31A1C' },
  { value: '> 20000', color: '#BD0026' },
];
