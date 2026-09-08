// ==============================================================================
// MTO MALUNGON - REAL-TIME WEATHER TELEMETRY & DRRMO SERVICE
// Coordinates: 6.2234° N, 125.2812° E (Malungon, Sarangani Province, Region XII)
// Powered by Open-Meteo Public Meteorological Feed (Free & No API Key Required)
// ==============================================================================

export interface WeatherTelemetryData {
  temperature: number; // in °C
  humidity: number; // in %
  windSpeed: number; // in km/h
  windDirection: string; // e.g., 'SSW', 'NE'
  windDegrees: number;
  cloudCover: number; // in %
  precipitation: number; // in mm
  weatherCode: number;
  condition: string; // e.g., 'Partly Cloudy'
  conditionDetails: string;
  safetyLevel: 'Normal Safety Level' | 'Advisory Watch' | 'Hazard Alert';
  trailStatus: 'Dry & Accessible' | 'Damp / 4x4 Preferred' | 'Slippery / Restricted';
  iconType: 'clear' | 'partly_cloudy' | 'overcast' | 'rain' | 'thunderstorm';
  lastUpdated: string;
  isLive: boolean;
}

export function degreesToCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function interpretWmoCode(code: number, precipitation: number, windSpeed: number): {
  condition: string;
  conditionDetails: string;
  safetyLevel: 'Normal Safety Level' | 'Advisory Watch' | 'Hazard Alert';
  trailStatus: 'Dry & Accessible' | 'Damp / 4x4 Preferred' | 'Slippery / Restricted';
  iconType: 'clear' | 'partly_cloudy' | 'overcast' | 'rain' | 'thunderstorm';
} {
  if (code >= 95) {
    return {
      condition: 'Thunderstorms Detected',
      conditionDetails: 'Highland lightning and storm activity over mountain ridges. Outdoor activities restricted.',
      safetyLevel: 'Hazard Alert',
      trailStatus: 'Slippery / Restricted',
      iconType: 'thunderstorm',
    };
  }
  if (code >= 80 || code === 65) {
    return {
      condition: 'Heavy Rain Showers',
      conditionDetails: 'Substantial highland rainfall. River and mountain trail crossings should be monitored.',
      safetyLevel: 'Advisory Watch',
      trailStatus: 'Slippery / Restricted',
      iconType: 'rain',
    };
  }
  if (code >= 61 || code >= 51) {
    return {
      condition: 'Light Rain / Drizzle',
      conditionDetails: 'Light highland precipitation. Mountain roads damp; 4x4 recommended for Kalon Barak.',
      safetyLevel: 'Normal Safety Level',
      trailStatus: 'Damp / 4x4 Preferred',
      iconType: 'rain',
    };
  }
  if (code === 45 || code === 48) {
    return {
      condition: 'Mountain Mist / Fog',
      conditionDetails: 'Cool highland fog blankets ridge lookouts. Reduced driving visibility.',
      safetyLevel: 'Normal Safety Level',
      trailStatus: 'Damp / 4x4 Preferred',
      iconType: 'partly_cloudy',
    };
  }
  if (code === 3) {
    return {
      condition: 'Overcast Skies',
      conditionDetails: 'Overcast highland canopy. Good trekking weather with minimal solar heat.',
      safetyLevel: 'Normal Safety Level',
      trailStatus: 'Dry & Accessible',
      iconType: 'overcast',
    };
  }
  if (code === 1 || code === 2) {
    return {
      condition: 'Partly Cloudy Skies',
      conditionDetails: 'Ideal cloud-chasing mountain breeze across Kalon Barak Skyline Ridge and eco-trails.',
      safetyLevel: 'Normal Safety Level',
      trailStatus: 'Dry & Accessible',
      iconType: 'partly_cloudy',
    };
  }
  return {
    condition: 'Clear & Sunny',
    conditionDetails: 'Sunny clear skies over Malungon highlands. Excellent panoramic visibility across Sarangani and Mt. Matutum.',
    safetyLevel: 'Normal Safety Level',
    trailStatus: 'Dry & Accessible',
    iconType: 'clear',
  };
}

export const DEFAULT_WEATHER_TELEMETRY: WeatherTelemetryData = {
  temperature: 28,
  humidity: 70,
  windSpeed: 10,
  windDirection: 'NE',
  windDegrees: 45,
  cloudCover: 30,
  precipitation: 0.0,
  weatherCode: 2,
  condition: 'Partly Cloudy Skies',
  conditionDetails: 'Partly cloudy mountain skies over Kalon Barak Skyline Ridge and Alkikan forest reserve. Gentle highland breeze.',
  safetyLevel: 'Normal Safety Level',
  trailStatus: 'Dry & Accessible',
  iconType: 'partly_cloudy',
  lastUpdated: 'Cached / Normal',
  isLive: false,
};

export async function fetchLiveWeatherTelemetry(): Promise<WeatherTelemetryData> {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=6.2234&longitude=125.2812&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover,precipitation&timezone=Asia%2FManila'
    );
    if (!res.ok) {
      throw new Error(`Weather fetch failed: ${res.statusText}`);
    }
    const data = await res.json();
    const cur = data.current;

    const temp = Math.round(cur.temperature_2m * 10) / 10;
    const humidity = Math.round(cur.relative_humidity_2m);
    const windSpeed = Math.round(cur.wind_speed_10m * 10) / 10;
    const windDegrees = cur.wind_direction_10m ?? 0;
    const windDirection = degreesToCardinal(windDegrees);
    const cloudCover = Math.round(cur.cloud_cover ?? 0);
    const precipitation = cur.precipitation ?? 0;
    const weatherCode = cur.weather_code ?? 0;

    const interpreted = interpretWmoCode(weatherCode, precipitation, windSpeed);

    const now = new Date();
    const lastUpdated = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const telemetry: WeatherTelemetryData = {
      temperature: temp,
      humidity,
      windSpeed,
      windDirection,
      windDegrees,
      cloudCover,
      precipitation,
      weatherCode,
      ...interpreted,
      lastUpdated,
      isLive: true,
    };

    try {
      localStorage.setItem('mtodms_weather_cache', JSON.stringify(telemetry));
    } catch {
      // Ignore storage errors
    }

    return telemetry;
  } catch (err) {
    console.warn('[Weather Telemetry] Live fetch failed, using cached fallback:', err);
    try {
      const cached = localStorage.getItem('mtodms_weather_cache');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Ignore
    }
    return DEFAULT_WEATHER_TELEMETRY;
  }
}
