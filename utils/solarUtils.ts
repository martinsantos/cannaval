// Solar position calculation utilities
// Based on simplified solar position algorithm

export interface SolarPosition {
  azimuth: number;   // Degrees from north (0=N, 90=E, 180=S, 270=W)
  altitude: number;  // Degrees above horizon (0=horizon, 90=zenith)
}

/**
 * Calculate solar position for a given date, time, and location
 * @param date - Date object
 * @param latitude - Latitude in degrees
 * @param longitude - Longitude in degrees
 * @returns Solar position (azimuth and altitude)
 */
export function calculateSolarPosition(
  date: Date,
  latitude: number,
  longitude: number
): SolarPosition {
  // Julian day calculation
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  jd = jd + (hour - 12) / 24;

  // Time in Julian centuries from J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // Mean longitude of the sun
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  L0 = L0 % 360;
  if (L0 < 0) L0 += 360;

  // Mean anomaly
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  M = M % 360;
  if (M < 0) M += 360;

  const Mrad = M * Math.PI / 180;

  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);

  // True longitude
  const L = L0 + C;

  // Apparent longitude
  const omega = 125.04 - 1934.136 * T;
  const lambda = L - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);

  // Obliquity of ecliptic
  const epsilon = 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
  const epsilonRad = epsilon * Math.PI / 180;

  // Right ascension and declination
  const lambdaRad = lambda * Math.PI / 180;
  let alpha = Math.atan2(Math.cos(epsilonRad) * Math.sin(lambdaRad), Math.cos(lambdaRad));
  alpha = alpha * 180 / Math.PI;
  if (alpha < 0) alpha += 360;

  const delta = Math.asin(Math.sin(epsilonRad) * Math.sin(lambdaRad));
  const deltaRad = delta;

  // Greenwich mean sidereal time
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000;
  
  // Local sidereal time
  let lst = (gmst + longitude) % 360;
  if (lst < 0) lst += 360;

  // Hour angle
  let H = lst - alpha;
  if (H < -180) H += 360;
  if (H > 180) H -= 360;
  const Hrad = H * Math.PI / 180;

  // Convert to radians
  const latRad = latitude * Math.PI / 180;

  // Altitude
  const sinAlt = Math.sin(latRad) * Math.sin(deltaRad) + Math.cos(latRad) * Math.cos(deltaRad) * Math.cos(Hrad);
  const altitude = Math.asin(sinAlt) * 180 / Math.PI;

  // Azimuth
  const cosAz = (Math.sin(deltaRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI;
  
  if (H > 0) {
    azimuth = 360 - azimuth;
  }

  return { azimuth, altitude };
}

/**
 * Calculate shadow length and direction for an object
 * @param objectHeight - Height of object in same units as desired shadow length
 * @param solarAltitude - Solar altitude in degrees
 * @param solarAzimuth - Solar azimuth in degrees
 * @param gardenNorth - Garden orientation (degrees, 0=up is north)
 * @returns Shadow vector {dx, dy, length}
 */
export function calculateShadow(
  objectHeight: number,
  solarAltitude: number,
  solarAzimuth: number,
  gardenNorth: number = 0
): { dx: number; dy: number; length: number } {
  if (solarAltitude <= 0) {
    // Sun below horizon, no shadow or infinite shadow
    return { dx: 0, dy: 0, length: 0 };
  }

  // Shadow length
  const shadowLength = objectHeight / Math.tan(solarAltitude * Math.PI / 180);

  // Shadow direction (opposite of sun)
  const shadowAzimuth = (solarAzimuth + 180) % 360;

  // Adjust for garden orientation
  const adjustedAzimuth = (shadowAzimuth - gardenNorth) % 360;
  const radians = adjustedAzimuth * Math.PI / 180;

  // Convert to dx, dy (SVG coordinates: +x=right, +y=down)
  // Azimuth 0=north=up=-y, 90=east=right=+x, 180=south=down=+y, 270=west=left=-x
  const dx = shadowLength * Math.sin(radians);
  const dy = -shadowLength * Math.cos(radians);

  return { dx, dy, length: shadowLength };
}

/**
 * Get light intensity factor (0-1) based on solar altitude
 */
export function getLightIntensity(solarAltitude: number): number {
  if (solarAltitude <= 0) return 0;
  if (solarAltitude >= 90) return 1;
  // Simplified: intensity increases with altitude
  return Math.sin(solarAltitude * Math.PI / 180);
}
