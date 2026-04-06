export const CDMX_EDOMEX_BOUNDS = {
  north: 20.35,
  south: 18.3,
  west: -100.9,
  east: -98.35
} as const;

export function isWithinCdmxEdomex(lat: number, lng: number) {
  return lat >= CDMX_EDOMEX_BOUNDS.south && lat <= CDMX_EDOMEX_BOUNDS.north && lng >= CDMX_EDOMEX_BOUNDS.west && lng <= CDMX_EDOMEX_BOUNDS.east;
}
