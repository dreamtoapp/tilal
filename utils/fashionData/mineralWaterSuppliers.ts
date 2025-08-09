import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dhyh7aufp',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getLogoImageFiles() {
  const result = await cloudinary.search
    .expression('folder:mineral-water-demo/logos')
    .max_results(100)
    .execute();
  return result.resources.map((file: any) => file.public_id.replace('mineral-water-demo/logos/', '') + '.' + file.format);
}

export async function getSupplierSeedData() {
  const imageFiles = await getLogoImageFiles();
  const cloudName = 'dhyh7aufp';
  const supplierNames = [
    "Nestle Waters",
    "Nova",
    "Berain"
    // ...add more as needed
  ];
  return supplierNames.map((name, i) => ({
    name,
    slug: name.toLowerCase().replace(/ /g, '-'),
    logo: `https://res.cloudinary.com/${cloudName}/image/upload/mineral-water-demo/logos/${imageFiles[i % imageFiles.length]}`,
    email: `info@${name.toLowerCase().replace(/ /g, '')}.com`,
    phone: '+966112233445',
    address: 'Saudi Arabia',
    type: 'WATER_SUPPLIER'
  }));
} 