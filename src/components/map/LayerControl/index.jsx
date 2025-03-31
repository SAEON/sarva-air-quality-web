import { Box, FormControl, FormGroup, FormControlLabel, Checkbox, Typography, Paper } from '@mui/material';

function LayerControl({ layers, activeLayers, onLayerToggle }) {
  return (
    <Paper sx={{ 
      position: 'absolute', 
      top: 10, 
      right: 10,
      zIndex: 1000,
      p: 2,
      width: 250,
      boxShadow: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    }}>
      <Typography variant="subtitle1" gutterBottom>Map Layers</Typography>
      <FormControl component="fieldset">
        <FormGroup>
          {layers.map(layer => (
            <FormControlLabel
              key={layer.id}
              control={
                <Checkbox
                  checked={activeLayers.includes(layer.id)}
                  onChange={() => onLayerToggle(layer.id)}
                  name={layer.id}
                />
              }
              label={layer.label}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Paper>
  );
}

export default LayerControl;