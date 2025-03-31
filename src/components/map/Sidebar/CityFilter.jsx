import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAllCities } from '@/api/airQuality';

function CityFilter({ selectedCities, onChange }) {
  const { data: citiesData, isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: getAllCities,
  });

  const handleChange = (event) => {
    const value = event.target.value;
    onChange(value);
  };

  if (isLoading) {
    return <Typography>Loading cities...</Typography>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="city-filter-label">Cities</InputLabel>
        <Select
          labelId="city-filter-label"
          id="city-filter"
          multiple
          value={selectedCities}
          onChange={handleChange}
          input={<OutlinedInput label="Cities" />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return 'Select cities';
            }
            if (selected.length === citiesData?.length) {
              return 'All cities';
            }
            if (selected.length > 3) {
              return `${selected.length} cities selected`;
            }
            return selected.join(', ');
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 224,
                width: 250,
              },
            },
          }}
        >
          {citiesData?.map((city) => (
            <MenuItem key={city} value={city}>
              <Checkbox checked={selectedCities.indexOf(city) > -1} />
              <ListItemText primary={city} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CityFilter;
