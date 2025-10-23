// utils/sunlightUtils.ts

// Function to convert degrees to radians
const toRadians = (degrees: number): number => degrees * Math.PI / 180;

// Function to convert radians to degrees
const toDegrees = (radians: number): number => radians * 180 / Math.PI;

interface SolarCalcs {
    sunriseUTC: number;
    sunsetUTC: number;
    daylightHours: number;
}

/**
 * Performs the core solar calculations for a given location and date.
 * Returns times in minutes from UTC midnight and daylight in hours.
 * Based on NOAA's solar calculation methods.
 */
function getSolarCalculations(lat: number, lon: number, date: Date): SolarCalcs {
    // We want to calculate for the local day, so we adjust the date object to be noon UTC
    // to avoid issues with timezone crossings affecting the day of year calculation.
    const noonDate = new Date(date);
    noonDate.setUTCHours(12, 0, 0, 0);

    const dayOfYear = Math.floor((noonDate.getTime() - new Date(noonDate.getUTCFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // 1. Fractional year in radians
    const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (12 - 12) / 24);

    // 2. Equation of Time (in minutes)
    const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));

    // 3. Solar Declination (in radians)
    const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma) - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);

    // 4. Hour Angle (in radians)
    const latRad = toRadians(lat);
    const cosHourAngle = (Math.cos(toRadians(90.833)) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));

    // Check for polar day/night
    if (cosHourAngle > 1) { // Sun is always below horizon
        return { sunriseUTC: NaN, sunsetUTC: NaN, daylightHours: 0 };
    }
    if (cosHourAngle < -1) { // Sun is always above horizon
        return { sunriseUTC: NaN, sunsetUTC: NaN, daylightHours: 24 };
    }

    const ha = Math.acos(cosHourAngle); // Hour angle in radians
    
    // 5. Calculate sunrise and sunset time in minutes past midnight (UTC)
    const solarNoon = 720 - 4 * lon - eqtime; // in minutes from UTC midnight
    const sunriseUTC = solarNoon - toDegrees(ha) * 4;
    const sunsetUTC = solarNoon + toDegrees(ha) * 4;
    
    // 6. Calculate daylight hours
    const daylightHours = toDegrees(ha) * 8 / 60; // Simplified from 2 * ha_degrees / 15
    
    return { sunriseUTC, sunsetUTC, daylightHours };
}

export interface DayData {
    date: Date;
    dayOfYear: number;
    daylight: number;
}

/**
 * Calculates the approximate daylight hours for a given latitude and date.
 * @param latitude The latitude in degrees.
 * @param date The date for which to calculate daylight hours.
 * @returns The number of daylight hours.
 */
export const calculateDaylightHours = (latitude: number, date: Date): number => {
    // Longitude has a negligible effect on total daylight hours.
    const { daylightHours } = getSolarCalculations(latitude, 0, date);
    return daylightHours;
};


/**
 * Calculates sunrise and sunset times for a given location and date.
 * @param lat Latitude
 * @param lon Longitude
 * @param date The specific date
 * @param tzOffset Timezone offset from UTC in minutes (as returned by getTimezoneOffset())
 * @returns Object with sunrise and sunset time strings (HH:MM)
 */
export const calculateSunriseSunset = (lat: number, lon: number, date: Date, tzOffset: number) => {
    const { sunriseUTC, sunsetUTC } = getSolarCalculations(lat, lon, date);

    // Adjust for local timezone. The offset is subtracted because getTimezoneOffset()
    // returns a positive value for timezones west of UTC.
    const sunriseLocalMins = sunriseUTC - tzOffset;
    const sunsetLocalMins = sunsetUTC - tzOffset;

    const formatTime = (timeInMinutes: number) => {
        if (isNaN(timeInMinutes)) return "--:--";

        // Handle times that wrap around midnight
        const totalMinutes = (Math.round(timeInMinutes) + 1440) % 1440;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    return {
        sunrise: formatTime(sunriseLocalMins),
        sunset: formatTime(sunsetLocalMins),
    };
};


/**
 * Generates daylight data for every day of a given year.
 * @param latitude The latitude of the location.
 * @param year The year for which to generate data.
 * @returns An array of DayData objects.
 */
export const getYearlyData = (latitude: number, year: number): DayData[] => {
    const data: DayData[] = [];
    const startDate = new Date(year, 0, 1);

    for (let i = 0; i < 366; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        // Stop if we've entered the next year (for non-leap years)
        if (date.getFullYear() !== year) {
            break;
        }

        data.push({
            date: date,
            dayOfYear: i + 1,
            daylight: calculateDaylightHours(latitude, date),
        });
    }

    return data;
};

/**
 * Generates monthly average daylight hours for a 6-month period starting from a given date.
 * @param latitude The latitude of the location.
 * @param startDate The start date of the cultivation.
 * @returns An array of objects, each containing the month name and average daylight hours.
 */
export const getMonthlyDaylightAverages = (latitude: number, startDate: string): { month: string; hours: number }[] => {
    const start = new Date(startDate);
    const monthlyAverages: { month: string; hours: number }[] = [];

    for (let i = 0; i < 6; i++) { // Analyze a 6-month season
        const monthDate = new Date(start.getFullYear(), start.getMonth() + i, 1);
        const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
        
        // Calculate daylight for the 1st, 15th and last day of the month for a simple average
        const h1 = calculateDaylightHours(latitude, new Date(monthDate.getFullYear(), monthDate.getMonth(), 1));
        const h15 = calculateDaylightHours(latitude, new Date(monthDate.getFullYear(), monthDate.getMonth(), 15));
        const hLast = calculateDaylightHours(latitude, new Date(monthDate.getFullYear(), monthDate.getMonth(), daysInMonth));
        
        const averageHours = (h1 + h15 + hLast) / 3;
        
        monthlyAverages.push({
            month: monthDate.toLocaleString('default', { month: 'long' }),
            hours: parseFloat(averageHours.toFixed(2)),
        });
    }

    return monthlyAverages;
};