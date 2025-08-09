import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dhyh7aufp',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getOfferImageFiles() {
  const result = await cloudinary.search
    .expression('folder:mineral-water-demo/offers')
    .max_results(100)
    .execute();
  return result.resources.map((file: any) => file.public_id.replace('mineral-water-demo/offers/', '') + '.' + file.format);
}

export async function getOfferSeedData() {
  const imageFiles = await getOfferImageFiles();
  const cloudName = 'dhyh7aufp';
  const offerNames = [
    "Summer Hydration Sale",
    "Office Essentials Bundle",
    "Family Pack Deal"
  ];
  return offerNames.map((name, i) => ({
    name,
    slug: name.toLowerCase().replace(/ /g, '-'),
    description: `Description for ${name}`,
    bannerImage: `https://res.cloudinary.com/${cloudName}/image/upload/mineral-water-demo/offers/${imageFiles[i % imageFiles.length]}`
  }));
} 