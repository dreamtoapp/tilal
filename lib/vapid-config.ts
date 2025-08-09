// VAPID Configuration for Web Push Notifications
export const VAPID_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
  subject: process.env.VAPID_SUBJECT || 'mailto:admin@dreamtoapp.com',
  email: process.env.VAPID_EMAIL || 'admin@dreamtoapp.com'
};

// Validate VAPID configuration
export function validateVapidConfig() {
  if (!VAPID_CONFIG.publicKey) {
    throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured');
  }
  if (!VAPID_CONFIG.privateKey) {
    throw new Error('VAPID_PRIVATE_KEY is not configured');
  }
  if (!VAPID_CONFIG.subject) {
    throw new Error('VAPID_SUBJECT is not configured');
  }
  
  console.log('✅ VAPID configuration validated successfully');
  return true;
}

// Convert base64 string to Uint8Array for browser
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Get VAPID public key for client-side use
export function getVapidPublicKey(): string {
  if (!VAPID_CONFIG.publicKey) {
    throw new Error('VAPID public key not configured');
  }
  return VAPID_CONFIG.publicKey;
} 