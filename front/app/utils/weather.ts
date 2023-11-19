// Return N, NE, E, SE, S etc. from a given degree
const windDirectionFromDegrees = (degrees: number) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export default windDirectionFromDegrees;
