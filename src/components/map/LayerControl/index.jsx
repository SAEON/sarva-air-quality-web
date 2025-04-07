import {
  Box,
  FormControl,
  FormGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Paper,
} from '@mui/material';

/**
 * LayerControl component that allows selecting exactly one layer at a time
 *
 * @param {Object} props
 * @param {Array} props.layers - Available layers [{id, label}]
 * @param {Array} props.activeLayers - Current active layers array (for compatibility)
 * @param {Function} props.onLayerToggle - Callback when layer toggle changes
 */
function LayerControl({ layers, activeLayers, onLayerToggle }) {
  const activeLayer = activeLayers.length > 0 ? activeLayers[0] : null;

  const handleLayerChange = (event) => {
    const newLayerId = event.target.value;

    if (activeLayers.length === 1 && activeLayers[0] === newLayerId) {
      onLayerToggle(newLayerId);
    } else {
      activeLayers.forEach((layer) => {
        if (layer !== newLayerId) {
          onLayerToggle(layer);
        }
      });

      if (!activeLayers.includes(newLayerId)) {
        onLayerToggle(newLayerId);
      }
    }
  };

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        p: 2,
        width: 250,
        boxShadow: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Map Layers
      </Typography>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup value={activeLayer || ''} onChange={handleLayerChange}>
          {layers.map((layer) => (
            <FormControlLabel
              key={layer.id}
              value={layer.id}
              control={<Radio />}
              label={layer.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Paper>
  );
}

export default LayerControl;
