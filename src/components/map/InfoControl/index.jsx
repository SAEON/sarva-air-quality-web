import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaInfoCircle } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import '@/styles/InfoControl.scss';

const InfoControl = ({ position = 'topright', onInfoToggle }) => {
  const [showInfo, setShowInfo] = useState(false);
  const map = useMap();

  // Handle info toggling and notify parent component
  const toggleInfo = (show) => {
    setShowInfo(show);
    if (onInfoToggle) {
      onInfoToggle(show);
    }
  };

  // Create a custom Leaflet control
  useEffect(() => {
    const infoControl = L.control({ position });

    infoControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'info-control-container');

      // Prevent click events from propagating to the map
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      // Render the button
      const root = createRoot(div);
      root.render(
        <button
          className="info-button"
          onClick={() => toggleInfo(!showInfo)}
          aria-label="Map information"
        >
          <FaInfoCircle />
        </button>,
      );

      return div;
    };

    infoControl.addTo(map);

    // Clean up when component unmounts
    return () => {
      infoControl.remove();
    };
  }, [map, position, showInfo]);

  // Render the popup via Portal to avoid rendering issues within the Leaflet control
  const InfoPopup = () => {
    if (!showInfo) return null;

    return createPortal(
      <div className="info-popup-overlay" onClick={() => toggleInfo(false)}>
        <div className="info-popup" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={() => toggleInfo(false)} aria-label="Close">
            ×
          </button>
          <h2>African Air Quality (PM2.5) Predictions</h2>
          <div className="info-content">
            <p>
              According to the United Nations, 54% of the world's population resides in urban areas
              in the year 2014. It is projected that by 2050 this number will increase by 12%. The
              direct effect of this urban drift has had profound effects on social, economic and
              ecological systems, causing stresses on the environment and society.
            </p>
            <p>
              The social and economic implications include impacts from human activities such as
              transport, industrialization, combustion, construction etc., all of which have a
              direct or indirect bearing on the environment. These pollution sources have led to
              release of pollutants such as Nitrogen dioxide (NO2), Particulate Matter (PM) and
              Sulphur dioxide (SO2) into the atmosphere. It is believed that air pollution is
              influenced by urban dynamics.
            </p>
            <p>
              In this project, we present a method for predicting historical air quality (as
              measured by daily median PM25 concentration) for locations where no ground-based
              sensors are present, by using weather data and remote sensing data from sources like
              the Sentinel 5P satellite.
            </p>
            <p>
              Air quality data is obtained for 555 cities and supplemented by satellite and weather
              data. This is then used to build a model to predict the air quality for a given date
              and location. A competition hosted by Zindi was used to crowd-source the creation of
              the model used, with the winning code forming the basis of our modelling approach.
            </p>
            <p>
              We use the trained model to create a new dataset of historical air quality predictions
              for cities across Africa, available at{' '}
              <a
                href="https://github.com/johnowhitaker/air_quality_prediction"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://github.com/johnowhitaker/air_quality_prediction
              </a>
              .
            </p>
            <p>
              For access to the original data, see{' '}
              <a
                href="https://search.datacite.org/works/10.15493/sarva.301020-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://search.datacite.org/works/10.15493/sarva.301020-2
              </a>
              .
            </p>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  return <InfoPopup />;
};

export default InfoControl;
