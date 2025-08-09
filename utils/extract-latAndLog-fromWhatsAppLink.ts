export interface CoordinateResult {
  lat: number;
  lng: number;
}

export function extractCoordinatesFromUrl(url: string): CoordinateResult | null {
  try {
    const decoded = decodeURIComponent(url);
    
    // Pattern 1: Google Maps direct coordinates (maps.google.com/maps?q=lat,lng)
    let match = decoded.match(/maps\.google\.com\/maps\?q=([-.\d]+),([-.\d]+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    // Pattern 2: Google Maps with @coordinates (@lat,lng,zoom)
    match = decoded.match(/@([-.\d]+),([-.\d]+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    // Pattern 3: WhatsApp shared location (various formats)
    match = decoded.match(/(?:maps\.google\.com|google\.com\/maps|goo\.gl\/maps).*?[-\s=@]([-.\d]+),\s*([-.\d]+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    // Pattern 4: Direct coordinates in URL (lat,lng format anywhere in URL)
    match = decoded.match(/([-.\d]{2,})\s*,\s*([-.\d]{2,})/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      // Validate reasonable coordinate ranges
      if (!isNaN(lat) && !isNaN(lng) && 
          lat >= -90 && lat <= 90 && 
          lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function isValidSharedLocationLink(url: string): boolean {
  try {
    const decoded = decodeURIComponent(url.toLowerCase());
    
    // Check for various map service patterns
    const patterns = [
      /maps\.google\.com/,
      /google\.com\/maps/,
      /goo\.gl\/maps/,
      /maps\.app\.goo\.gl/,
      /plus\.codes/,
      // Check for coordinate patterns
      /[-.\d]+\s*,\s*[-.\d]+/
    ];

    return patterns.some(pattern => pattern.test(decoded));
  } catch {
    return false;
  }
}

// Helper function to format coordinates for display
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

// Helper function to generate Google Maps URL from coordinates
export function generateGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
