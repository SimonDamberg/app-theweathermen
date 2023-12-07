import { providerToTS } from "./location";

// Return N, NE, E, SE, S etc. from a given degree
export const windDirectionFromDegrees = (degrees: number) => {
  const directionTranslationName = [
    "northShort",
    "northEastShort",
    "eastShort",
    "southEastShort",
    "southShort",
    "southWestShort",
    "westShort",
    "northWestShort",
  ];
  const index = Math.round(degrees / 45) % 8;
  return directionTranslationName[index];
};

/**
 * Return the average of a given field from a given data
 * @param data: data from API
 * @param field: field to get the average from
 * @param enabledProviders: providers to calculate the average from
 */
export const getAverageRightNowData = (
  data: any,
  field: string,
  enabledProviders: string[]
) => {
  enabledProviders = enabledProviders.filter((p) => p !== "Average");
  const enabledData = enabledProviders.map((provider) => {
    return data[providerToTS[provider]][0];
  });
  if (field === "weatherSymbol") {
    const weatherSymbols = enabledData.map((d) => d[field]);
    return avgWeatherSymbol(weatherSymbols);
  }
  const average = enabledData.reduce(
    (acc: number, d: any) => acc + d[field],
    0
  );
  return average / enabledData.length;
};

const avgWeatherSymbol = (symbs: number[]): number => {
  if (symbs.length === 1) return symbs[0];
  if (symbs.length === 2) {
    /* 
      1. Clear sky
      2. Partly cloudy
      3. Cloudy sky
      4. Overcast
      5. Fog
      6. Light rain showers
      7. Light snow showers
      8. Light sleet showers
      9. Thunderstorm
      10. Light or moderate rain
      11. Moderate rain showers
      12. Heavy rain
      13. Sleet
      14. Light or moderate snowfall
      15. Moderate or heavy snow showers
      16. Heavy snowfall
      17. Hail
      18. Heavy rain showers
      19. Moderate or heavy sleet showers
     */
    // In severity order, they are 17, 16, 15, 13, 14, 19, 18, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
    if (symbs.includes(17)) return 17;
    if (symbs.includes(16)) return 16;
    if (symbs.includes(15)) return 15;
    if (symbs.includes(13)) return 13;
    if (symbs.includes(14)) return 14;
    if (symbs.includes(19)) return 19;
    if (symbs.includes(18)) return 18;
    if (symbs.includes(12)) return 12;
    if (symbs.includes(11)) return 11;
    if (symbs.includes(10)) return 10;
    if (symbs.includes(9)) return 9;
    if (symbs.includes(8)) return 8;
    if (symbs.includes(7)) return 7;
    if (symbs.includes(6)) return 6;
    if (symbs.includes(5)) return 5;
    if (symbs.includes(4)) return 4;
    if (symbs.includes(3)) return 3;
    if (symbs.includes(2)) return 2;
    if (symbs.includes(1)) return 1;
  }
  if (symbs.length === 3) {
    // Return the most common one
    let count = 0;
    let mostCommon = 0;
    for (let i = 0; i < symbs.length; i++) {
      let currCount = 0;
      for (let j = 0; j < symbs.length; j++) {
        if (symbs[i] === symbs[j]) currCount++;
      }
      if (currCount > count) {
        count = currCount;
        mostCommon = symbs[i];
      }
    }
    return mostCommon;
  }
  return 1;
};
