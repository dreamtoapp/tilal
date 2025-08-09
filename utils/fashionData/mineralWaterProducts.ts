// utils/fashionData/mineralWaterProducts.ts
// Mineral water product templates for seeding

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dhyh7aufp',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getProductImageFiles() {
  const result = await cloudinary.search
    .expression('folder:mineral-water-demo/products')
    .max_results(100)
    .execute();
  return result.resources.map((file: any) => file.public_id.replace('mineral-water-demo/products/', '') + '.' + file.format);
}

export async function getProductSeedData() {
  const imageFiles = await getProductImageFiles();
  const cloudName = 'dhyh7aufp';
  // Example product names, expand as needed
  const productNames = [
    "AquaPure 1.5L",
    "Crystal Spring 500ml",
    "HydroFresh Sparkling 330ml",
    "EcoSip Reusable Bottle 750ml",
    "AlkaLife Alkaline 1L",
    "FruitSplash Lemon 500ml",
    "Mountain Spring 2L",
    "BlueWave Premium 1L",
    "NatureDrop 600ml",
    "VivaH2O Family Pack"
    // ...add more as needed
  ];
  return productNames.map((name, i) => ({
    name,
    slug: name.toLowerCase().replace(/ /g, '-'),
    description: `Description for ${name}`,
    imageUrl: `https://res.cloudinary.com/${cloudName}/image/upload/mineral-water-demo/products/${imageFiles[i % imageFiles.length]}`
  }));
}

export interface MineralWaterProductTemplate {
  categorySlug: string;
  names: string[];
  namesEn: string[];
  priceRange: { min: number; max: number };
  features: string[];
  featuresEn: string[];
  sizes: string[];
  brands: string[];
  stockChance: number;
  imageUrls: string[];
  productCount: number;
}

export const MINERAL_WATER_PRODUCT_TEMPLATES = [
  {
    names: [
      "AquaPure 1.5L",
      "Crystal Spring 500ml",
      "HydroFresh Sparkling 330ml",
      "EcoSip Reusable Bottle 750ml",
      "AlkaLife Alkaline 1L",
      "FruitSplash Lemon 500ml",
      "Mountain Spring 2L",
      "BlueWave Premium 1L",
      "NatureDrop 600ml",
      "VivaH2O Family Pack",
      "PureFlow 1L",
      "FreshMist 500ml",
      "Glacier Dew 1.5L",
      "HydraMax 2L",
      "SpringBliss 750ml",
      "AquaVita 330ml",
      "CrystalClear 1L",
      "EcoWave 600ml",
      "AlkaPlus 1.5L",
      "FruitSplash Orange 500ml",
      "BluePeak 1L",
      "NatureSpring 2L",
      "VivaH2O Mini Pack",
      "PureDrop 750ml",
      "FreshWave 1L",
      "Glacier Spring 500ml",
      "HydraFresh 2L",
      "SpringPure 1.5L",
      "AquaEssence 330ml",
      "CrystalMist 1L"
    ],
    priceRange: { min: 5, max: 25 },
    stockChance: 0.9,
    sizes: ["330ml", "500ml", "600ml", "750ml", "1L", "1.5L", "2L"],
    brands: [
      "AquaPure", "Crystal Spring", "HydroFresh", "EcoSip", "AlkaLife", "FruitSplash", "Mountain Spring", "BlueWave", "NatureDrop", "VivaH2O",
      "PureFlow", "FreshMist", "Glacier Dew", "HydraMax", "SpringBliss", "AquaVita", "CrystalClear", "EcoWave", "AlkaPlus", "FruitSplash",
      "BluePeak", "NatureSpring", "VivaH2O", "PureDrop", "FreshWave", "Glacier Spring", "HydraFresh", "SpringPure", "AquaEssence", "CrystalMist"
    ],
    features: [
      "Ultra-pure mineral water, bottled at the source.",
      "Eco-friendly packaging.",
      "Rich in essential minerals.",
      "Perfect for home, office, or on-the-go.",
      "Crisp, refreshing taste."
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=800&q=80"
    ]
  }
]; 