import apiClient from './index';

export const getAirQualityData = async ({ queryKey }) => {
  const [_, params] = queryKey;
  const response = await apiClient.get('/air-quality', { params });
  return response.data;
};


export const getAirQualityByDate = async ({ queryKey }) => {
  const [_, date] = queryKey;
  
  const formattedDate = date instanceof Date 
    ? date.toISOString().split('T')[0]
    : date.split('T')[0];
  
  const response = await apiClient.get(`/air-quality/date/${formattedDate}`);
  return response.data;
};

export const getAirQualityClustersByDate = async ({ queryKey }) => {
  const [_, date, zoom, viewport] = queryKey;
  const response = await apiClient.get(`/air-quality/clusters/date/${date}/${zoom}`, {
    params: viewport,
  });
  return response.data;
};

export const getAllCities = async () => {
  const response = await apiClient.get('/air-quality/cities');
  return response.data.cities;
};

export const getAllDates = async () => {
  const response = await apiClient.get('/air-quality/dates');
  return response.data;
};

export const getDateRange = async () => {
  const response = await apiClient.get('/air-quality/date-range');
  return response.data;
};

export const getTimeSeries = async ({ queryKey }) => {
  const [_, city, startDate, endDate] = queryKey;
  const response = await apiClient.get(`/air-quality/time-series/${city}`, {
    params: { startDate, endDate },
  });
  return response.data;
};


export const getPM25Stats = async () => {
  const response = await apiClient.get('/air-quality/stats/pm25');
  return response.data;
};


export const getPopulationDensityStats = async () => {
  const response = await apiClient.get('/air-quality/stats/population-density');
  return response.data;
};