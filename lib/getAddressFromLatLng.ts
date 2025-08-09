/**
 * Get address information from latitude and longitude using Nominatim (OpenStreetMap).
 * @param lat Latitude (number)
 * @param lon Longitude (number)
 * @returns Address data as returned by Nominatim API
 */
export async function getAddressFromLatLng(lat: number, lon: number): Promise<any> {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error('Failed to fetch address from Nominatim');
  }
  const data = await response.json();
  return data;
} 