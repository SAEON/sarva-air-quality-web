export const getPM25ColorScale = () => {
    // PM2.5 ranges based on EPA standards
    // Good: 0-12 µg/m³
    // Moderate: 12.1-35.4 µg/m³
    // Unhealthy for Sensitive Groups: 35.5-55.4 µg/m³
    // Unhealthy: 55.5-150.4 µg/m³
    // Very Unhealthy: 150.5-250.4 µg/m³
    // Hazardous: 250.5+ µg/m³
    
    const colors = ['#00E400', '#FFFF00', '#FF7E00', '#FF0000', '#8F3F97', '#7E0023'];
    const thresholds = [0, 12.1, 35.5, 55.5, 150.5, 250.5];
    
    return (value) => {
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (value >= thresholds[i]) {
          return colors[i];
        }
      }
      return colors[0]; 
    };
  };
  
  export const getPM25Level = (value) => {
    if (value <= 12) return { level: 'Good', description: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
    if (value <= 35.4) return { level: 'Moderate', description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' };
    if (value <= 55.4) return { level: 'Unhealthy for Sensitive Groups', description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' };
    if (value <= 150.4) return { level: 'Unhealthy', description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' };
    if (value <= 250.4) return { level: 'Very Unhealthy', description: 'Health alert: The risk of health effects is increased for everyone.' };
    return { level: 'Hazardous', description: 'Health warning of emergency conditions: everyone is more likely to be affected.' };
  };