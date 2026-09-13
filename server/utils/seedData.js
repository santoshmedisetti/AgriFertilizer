import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import logger from '../config/logger.js';

const seedData = async () => {
  try {
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();

    if (categoryCount === 0 && productCount === 0) {
      logger.info('Database is empty. Initiating automatic seeding...');

      // Find the admin user to attach to products
      const adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        logger.error('No admin user found. Cannot seed products.');
        return;
      }

      // 1. Seed Categories
      const categoriesData = [
        { name: 'Organic Fertilizers', slug: 'organic-fertilizers', image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0d30b9?w=400' },
        { name: 'Chemical Fertilizers', slug: 'chemical-fertilizers', image: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?w=400' },
        { name: 'Pesticides', slug: 'pesticides', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400' },
        { name: 'Premium Seeds', slug: 'premium-seeds', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400' },
        { name: 'Farming Tools', slug: 'farming-tools', image: 'https://images.unsplash.com/photo-1416879598555-2795e1c0b3b4?w=400' },
        { name: 'Plant Growth', slug: 'plant-growth', image: 'https://images.unsplash.com/photo-1599598425947-330026206a20?w=400' }
      ];
      
      const createdCategories = await Category.insertMany(categoriesData);
      
      const getCatId = (name) => createdCategories.find(c => c.name === name)._id;

      // 2. Seed Brands
      const brandsData = [
        { name: 'AgriPure', slug: 'agripure' },
        { name: 'ChemGrow', slug: 'chemgrow' },
        { name: 'SeedPro', slug: 'seedpro' },
        { name: 'FarmTech', slug: 'farmtech' }
      ];

      const createdBrands = await Brand.insertMany(brandsData);
      const getBrandId = (name) => createdBrands.find(b => b.name === name)._id;

      // 3. Seed Products
      const productsData = [
        {
          user: adminUser._id,
          name: 'Premium Organic Compost 5kg',
          sku: 'ORG-COMP-001',
          price: 599,
          discountPrice: 499,
          countInStock: 50,
          category: getCatId('Organic Fertilizers'),
          brand: getBrandId('AgriPure'),
          unit: 'kg',
          description: 'High-quality organic compost enriched with essential nutrients for superior plant growth.',
          benefits: ['Improves soil health', 'Increases water retention', '100% natural'],
          usageInstructions: 'Mix 1kg of compost with 5kg of soil before planting.',
          images: ['https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800'],
          rating: 4.8,
          numReviews: 124,
          isFeatured: true
        },
        {
          user: adminUser._id,
          name: 'Urea Fertilizer 46% N (50kg)',
          sku: 'CHEM-UREA-001',
          price: 400,
          discountPrice: 350,
          countInStock: 200,
          category: getCatId('Chemical Fertilizers'),
          brand: getBrandId('ChemGrow'),
          unit: 'bag',
          npkRatio: '46-0-0',
          description: 'High-nitrogen granular urea fertilizer ideal for rapid green growth in all crops.',
          benefits: ['Fast acting nitrogen', 'Highly soluble', 'Cost-effective'],
          usageInstructions: 'Apply evenly over the soil surface and water immediately.',
          images: ['https://images.unsplash.com/photo-1582647000100-349fceba0157?w=800'],
          rating: 4.5,
          numReviews: 89,
          isFeatured: true
        },
        {
          user: adminUser._id,
          name: 'Neem Oil Pesticide 1L',
          sku: 'PEST-NEEM-001',
          price: 399,
          discountPrice: 299,
          countInStock: 30,
          category: getCatId('Pesticides'),
          brand: getBrandId('AgriPure'),
          unit: 'litre',
          description: '100% cold-pressed organic neem oil for natural pest control.',
          benefits: ['Safe for bees and beneficial insects', 'Controls aphids and mites', 'Organic certified'],
          usageInstructions: 'Dilute 5ml in 1 litre of water and spray on foliage.',
          images: ['https://images.unsplash.com/photo-1615486511484-9189196b653f?w=800'],
          rating: 4.7,
          numReviews: 56,
          isFeatured: true
        },
        {
          user: adminUser._id,
          name: 'Hybrid Tomato Seeds (Pack of 100)',
          sku: 'SEED-TOM-001',
          price: 150,
          countInStock: 500,
          category: getCatId('Premium Seeds'),
          brand: getBrandId('SeedPro'),
          unit: 'pack',
          description: 'High-yielding, disease-resistant hybrid tomato seeds suitable for all climates.',
          benefits: ['High germination rate', 'Resistant to leaf curl virus', 'Large uniform fruits'],
          usageInstructions: 'Sow seeds 0.5cm deep in seed trays and transplant after 3 weeks.',
          images: ['https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800'],
          rating: 4.9,
          numReviews: 210,
          isFeatured: true
        },
        {
          user: adminUser._id,
          name: 'NPK 19-19-19 Water Soluble',
          sku: 'CHEM-NPK-019',
          price: 300,
          discountPrice: 250,
          countInStock: 100,
          category: getCatId('Chemical Fertilizers'),
          brand: getBrandId('ChemGrow'),
          unit: 'kg',
          npkRatio: '19-19-19',
          description: 'Perfectly balanced water-soluble fertilizer for all stages of plant growth.',
          benefits: ['Complete nutrition', '100% water soluble', 'Suitable for drip irrigation'],
          usageInstructions: 'Dissolve 5g in 1 litre of water and apply to roots or foliage.',
          images: ['https://images.unsplash.com/photo-1628102491629-778571d893a3?w=800'],
          rating: 4.6,
          numReviews: 45,
          isFeatured: true
        }
      ];

      await Product.insertMany(productsData);
      
      logger.info('Sample Data (Categories, Brands, Products) seeded successfully!');
    }
  } catch (error) {
    logger.error(`Error seeding sample data: ${error.message}`);
  }
};

export default seedData;
