// Return N, NE, E, SE, S etc. from a given degree
const windDirectionFromDegrees = (degrees: number) => {
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

export default windDirectionFromDegrees;
