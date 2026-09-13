import User from '../models/User.js';
import logger from '../config/logger.js';

const seedAdmin = async () => {
  try {
    const adminsToSeed = [
      {
        name: 'Administrator',
        email: 'admin@agrifertilizer.com',
        password: 'Admin@123',
        role: 'admin',
        isVerified: true
      },
      {
        name: 'Santosh Admin',
        email: 'admin@santosh.com',
        password: 'santosh@777',
        role: 'admin',
        isVerified: true
      }
    ];

    for (const adminData of adminsToSeed) {
      const adminExists = await User.findOne({ email: adminData.email });
      
      if (!adminExists) {
        await User.create(adminData);
        console.log('-----------------------------------');
        console.log('Default Admin Account Created:');
        console.log(`Email: ${adminData.email}`);
        console.log(`Password: ${adminData.password}`);
        console.log('-----------------------------------');
      }
    }
    
    logger.info('Default admin seeded successfully');
  } catch (error) {
    logger.error(`Error seeding admin: ${error.message}`);
  }
};

export default seedAdmin;
