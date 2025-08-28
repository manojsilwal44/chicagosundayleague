const { PrismaClient } = require('./src/generated/prisma');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Basic query result:', result);
    
    // Test if we can access the Event table
    const eventCount = await prisma.event.count();
    console.log('Event count:', eventCount);
    
    // Test if we can access the User table
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
