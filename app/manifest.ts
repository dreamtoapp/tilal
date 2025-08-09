import type { MetadataRoute } from 'next';
import { companyInfo } from './(e-comm)/actions/companyDetail';

function getCloudinaryIconUrl(baseUrl: string, size: number): string {
  if (!baseUrl || !baseUrl.includes('res.cloudinary.com')) return '';
  const [prefix, suffix] = baseUrl.split('/upload/');
  if (!suffix) return '';
  return `${prefix}/upload/c_fill,w_${size},h_${size},f_png/${suffix}`;
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const company = await companyInfo();
  const logo = company?.logo;
  const icon192 = getCloudinaryIconUrl(logo, 192) || '/icons/icon-192x192.png';
  const icon512 = getCloudinaryIconUrl(logo, 512) || '/icons/icon-512x512.png';
  return {
    id: '/',
    name: company?.fullName || 'Dream To App',
    short_name: company?.fullName || 'Dream To App',
    description: company?.bio || 'Your app description',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2196f3',
    icons: [
      {
        src: icon192,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: icon512,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/default-tall.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshots/default-tall.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
  };
}
