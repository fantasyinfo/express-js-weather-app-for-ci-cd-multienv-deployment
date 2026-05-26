import React, { useState, useEffect } from 'react';
import {
  CloudLightning,
  Search,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  CloudSun,
  CloudDrizzle,
  Snowflake,
  Cloud,
  CloudFog,
  Sun
} from 'lucide-react';

export default function App() {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');
  const [rateLimit, setRateLimit] = useState({
    limit: 10,
    remaining: 10,
    resetSeconds: 60
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
  // Fetch London weather on mount
  useEffect(() => {
    fetchWeather('Delhi');
  }, []);

  async function fetchWeather(city) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (data && data.rateLimit) {
        setRateLimit(data.rateLimit);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weather');
      }

      setWeatherData(data);
    } catch (err) {
      setError({
        title: 'Failed to fetch weather',
        message: err.message || 'Please check the city name and try again later.'
      });
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const city = cityInput.trim();
    if (city) {
      fetchWeather(city);
    }
  }

  // Get dynamic weather icons for description badge
  function getWeatherIcon(descText) {
    const desc = (descText || '').toLowerCase();
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) return CloudDrizzle;
    if (desc.includes('thunder') || desc.includes('storm')) return CloudLightning;
    if (desc.includes('snow') || desc.includes('sleet') || desc.includes('hail') || desc.includes('ice')) return Snowflake;
    if (desc.includes('cloud') || desc.includes('overcast')) return Cloud;
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return CloudFog;
    if (desc.includes('clear') || desc.includes('sunny')) return Sun;
    return CloudSun;
  }

  const WeatherIconComponent = weatherData ? getWeatherIcon(weatherData.current.weatherDesc) : CloudSun;

  // Rate Limiting badge dynamic colors
  let rateLimitClass = 'rate-limit-badge';
  let RateLimitIcon = ShieldCheck;
  if (rateLimit.remaining === 0) {
    rateLimitClass += ' danger';
    RateLimitIcon = ShieldAlert;
  } else if (rateLimit.remaining <= 3) {
    rateLimitClass += ' warning';
    RateLimitIcon = ShieldAlert;
  }

  // C/F conversions
  const tempVal = weatherData ? (unit === 'C' ? weatherData.current.temp_C : weatherData.current.temp_F) : '';
  const feelsLikeVal = weatherData ? (unit === 'C' ? weatherData.current.FeelsLikeC : weatherData.current.FeelsLikeF) : '';

  return (
    <>
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="container">
        {/* Header */}
        <header>
          <div className="logo-container">
            <CloudLightning className="logo-icon" size={36} />
            <h1>Nimbus Jenkins</h1>
          </div>
          <p className="subtitle">Experience Weather in Pure Clarity Jenkins</p>
        </header>

        {/* Search Bar Card */}
        <div className="glass-card">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search city (e.g. London, Tokyo)..."
                required
                autoComplete="off"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
              <Search className="input-icon" size={20} />
            </div>
            <button type="submit" className="search-btn">
              <span>Search</span>
              <ArrowRight size={18} />
            </button>
          </form>
          {/* Rate limiting badge */}
          <div className={rateLimitClass}>
            <RateLimitIcon size={14} />
            <span>Searches: {rateLimit.remaining}/{rateLimit.limit} remaining (resets in {rateLimit.resetSeconds}s)</span>
          </div>
        </div>

        {/* Status Card (Loading / Error) */}
        {loading && (
          <div className="glass-card status-message">
            <div className="spinner"></div>
            <h3 style={{ marginTop: '8px' }}>Fetching weather data...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
              Looking up coordinates and forecasts...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="glass-card status-message">
            <AlertCircle className="error-icon" size={48} />
            <h3 style={{ marginTop: '8px' }}>{error.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
              {error.message}
            </p>
          </div>
        )}

        {/* Weather Display Card */}
        {!loading && !error && weatherData && (
          <div className="glass-card weather-info">
            {/* Top Section */}
            <div className="weather-header">
              <div className="location-details">
                <h2>{weatherData.city}</h2>
                <p>
                  {[weatherData.region, weatherData.country].filter(Boolean).join(', ') || 'Unknown Region'}
                </p>
              </div>
              {/* C/F toggle */}
              <div className="unit-toggle">
                <button
                  className={`toggle-btn ${unit === 'C' ? 'active' : ''}`}
                  onClick={() => setUnit('C')}
                >
                  °C
                </button>
                <button
                  className={`toggle-btn ${unit === 'F' ? 'active' : ''}`}
                  onClick={() => setUnit('F')}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Temperature display */}
            <div className="main-weather-display">
              <div>
                <div className="temp-container">
                  <span className="temperature">{tempVal}</span>
                  <span className="temp-unit">°{unit}</span>
                </div>
                <div className="weather-desc-badge">
                  <WeatherIconComponent size={18} />
                  <span>{weatherData.current.weatherDesc}</span>
                </div>
              </div>
              {/* Floating icon */}
              <div className="weather-art">
                {weatherData.current.weatherIconUrl && (
                  <img
                    className="weather-icon-img"
                    src={weatherData.current.weatherIconUrl}
                    alt={weatherData.current.weatherDesc}
                  />
                )}
              </div>
            </div>

            {/* Information Grid */}
            <div className="weather-grid">
              <div className="grid-item">
                <div className="item-icon-wrapper">
                  <Thermometer size={20} />
                </div>
                <div className="item-details">
                  <span className="item-label">Feels Like</span>
                  <span className="item-value">{feelsLikeVal}°{unit}</span>
                </div>
              </div>
              <div className="grid-item">
                <div className="item-icon-wrapper">
                  <Droplets size={20} />
                </div>
                <div className="item-details">
                  <span className="item-label">Humidity</span>
                  <span className="item-value">{weatherData.current.humidity}%</span>
                </div>
              </div>
              <div className="grid-item">
                <div className="item-icon-wrapper">
                  <Wind
                    size={20}
                    style={{
                      transform: `rotate(${weatherData.current.winddirDegree}deg)`,
                      transition: 'transform 1s ease'
                    }}
                  />
                </div>
                <div className="item-details">
                  <span className="item-label">Wind Speed</span>
                  <span className="item-value">
                    {weatherData.current.windspeedKmph} km/h ({weatherData.current.winddir16Point})
                  </span>
                </div>
              </div>
              <div className="grid-item">
                <div className="item-icon-wrapper">
                  <Eye size={20} />
                </div>
                <div className="item-details">
                  <span className="item-label">Visibility</span>
                  <span className="item-value">{weatherData.current.visibility} km</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer>
          <p>
            Designed with premium aesthetics by{' '}
            <a href="https://www.linkedin.com/in/fantasy-info/" target="_blank" rel="noopener noreferrer">
              FantasyInfo
            </a>
            .{' '}Powered by{' '}
            <a href="https://wttr.in" target="_blank" rel="noopener noreferrer">
              wttr.in weather api
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
