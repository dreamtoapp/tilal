import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dhyh7aufp',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCategoryImageFiles() {
  const result = await cloudinary.search
    .expression('folder:mineral-water-demo/categories')
    .max_results(100)
    .execute();
  return result.resources.map((file: any) => file.public_id.replace('mineral-water-demo/categories/', '') + '.' + file.format);
}

export async function getCategorySeedData() {
  const imageFiles = await getCategoryImageFiles();
  const cloudName = 'dhyh7aufp';
  const categoryNames = [
    "Premium Bottled Water",
    "Spring Water",
    "Sparkling Water",
    "Large Water Dispensers",
    "Eco-Friendly Bottles",
    "Flavored Water",
    "Alkaline Water"
  ];
  return categoryNames.map((name, i) => ({
    name,
    slug: name.toLowerCase().replace(/ /g, '-'),
    description: `Description for ${name}`,
    imageUrl: `https://res.cloudinary.com/${cloudName}/image/upload/mineral-water-demo/categories/${imageFiles[i % imageFiles.length]}`
  }));
} 