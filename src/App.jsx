import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import MapView from './pages/MapView';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  useEffect(() => {
    const handleResize = () => {
      if (window.parent !== window) {
        // If in iframe, send resize message to parent
        window.parent.postMessage({ type: 'resize', height: document.body.scrollHeight }, '*');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MapView />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
