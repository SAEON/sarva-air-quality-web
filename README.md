# SARVA Air Quality Web

An interactive web application for visualising satellite-derived PM2.5 air quality data across Africa. Built for the [SARVA](https://catalogue.saeon.ac.za/records/10.15493/SARVA.301020-2) dataset published by SAEON.

---

## Features

- **Interactive map** — Leaflet-based map with marker clustering across ~1 400+ measurement sites
- **Time slider** — Play/pause animation through daily observations with a date timeline
- **Layer control** — Toggle between Air Quality (PM2.5) and Population Density views
- **Sidebar filters** — Filter by city, PM2.5 range, and population density range
- **Legends** — Colour-coded AQI and population density scales
- **Info panel** — Contextual information about the dataset
- **Download metadata** — Direct link to the SAEON data catalogue record

---

## Tech Stack

| Layer         | Technology                                            |
| ------------- | ----------------------------------------------------- |
| Framework     | React 19 + Vite 6                                     |
| Map           | Leaflet 1.9 + react-leaflet 5 + leaflet.markercluster |
| UI            | Material UI 6 + Emotion                               |
| Data fetching | TanStack Query v5 + Axios                             |
| Charts        | Recharts                                              |
| Date handling | date-fns                                              |
| Styling       | SASS                                                  |
| Linting       | ESLint + Prettier + Husky                             |

---

## Prerequisites

- Node.js 18+
- The [sarva-express-api](https://github.com/SAEON/sarva-express-api.git) backend running locally
- A PostgreSQL database seeded with SARVA air quality data

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/SAEON/sarva-air-quality-web.git
cd sarva-air-quality-web
npm install
```

### 2. Configure environment

Create a `.env.development` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

| Variable            | Description                 |
| ------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Base URL of the Express API |

### 3. Start the API

Start the [sarva-express-api](https://github.com/SAEON/sarva-express-api.git) backend first (see its README for setup), then confirm it is running on port 5000.

### 4. Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/air-quality/`.

---

## Available Scripts

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start development server with HMR    |
| `npm run build`    | Production build to `dist/`          |
| `npm run serve`    | Preview the production build locally |
| `npm run lint`     | Run ESLint                           |
| `npm run lint:fix` | Run ESLint and auto-fix issues       |
| `npm run format`   | Format all files with Prettier       |
| `npm run prepare`  | Install Husky git hooks              |

---

## Project Structure

```
src/
├── api/                  # Axios client and API functions
├── components/
│   └── map/
│       ├── AirQualityLayer/   # Leaflet marker cluster layer
│       ├── InfoControl/       # Info panel overlay
│       ├── LayerControl/      # Layer toggle control
│       ├── Legend/            # Map legend
│       ├── Sidebar/           # Filter sidebar
│       ├── TimeSlider/        # Date animation slider
│       └── logo/              # Logo components
├── pages/
│   └── MapView/          # Main map page
├── utils/
│   └── colorScale.js     # PM2.5 and population density colour scales
└── styles/               # Global SCSS styles
```

---

## Deployment

The app is configured with a base path of `/air-quality/`:

```js
// vite.config.js
base: '/air-quality/';
```

For production, set `VITE_API_BASE_URL` to your deployed API URL and run:

```bash
npm run build
```

The `dist/` folder can be served from any static host or reverse-proxied under `/air-quality/`.

---

## Data Source

Dataset: **Daily air quality estimates for urban centers in Africa**
Publisher: South African Environmental Observation Network (SAEON)
Catalogue: [10.15493/SARVA.301020-2](https://catalogue.saeon.ac.za/records/10.15493/SARVA.301020-2)
