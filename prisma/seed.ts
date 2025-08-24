import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create event categories
  const categories = [
    {
      name: 'Soccer',
      description: 'Football events and tournaments',
      icon: 'SportsSoccerIcon',
      color: '#4CAF50',
    },
    {
      name: 'Cricket',
      description: 'Cricket matches and tournaments',
      icon: 'SportsCricketIcon',
      color: '#FF9800',
    },
    {
      name: 'Tennis',
      description: 'Tennis matches and tournaments',
      icon: 'SportsTennisIcon',
      color: '#2196F3',
    },
    {
      name: 'Volleyball',
      description: 'Volleyball games and tournaments',
      icon: 'SportsVolleyballIcon',
      color: '#9C27B0',
    },
    {
      name: 'Pickleball',
      description: 'Pickleball games and tournaments',
      icon: 'SportsIcon',
      color: '#F44336',
    },
    {
      name: 'Video Games',
      description: 'Gaming tournaments and events',
      icon: 'SportsEsportsIcon',
      color: '#673AB7',
    },
    {
      name: 'Cooking',
      description: 'Culinary workshops and classes',
      icon: 'RestaurantIcon',
      color: '#795548',
    },
    {
      name: 'Tech',
      description: 'Technology workshops and meetups',
      icon: 'ComputerIcon',
      color: '#607D8B',
    },
    {
      name: 'Wellness',
      description: 'Health and wellness activities',
      icon: 'FitnessCenterIcon',
      color: '#E91E63',
    },
    {
      name: 'Other',
      description: 'Miscellaneous events',
      icon: 'EventIcon',
      color: '#757575',
    },
  ];

  for (const category of categories) {
    await prisma.eventCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Event categories created successfully');

  // Create a sample user if none exists
  const existingUser = await prisma.user.findFirst();
  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        email: 'admin@playon.com',
        passwordHash: 'sample-hash',
        passwordSalt: 'sample-salt',
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'User',
            displayName: 'Admin',
          },
        },
      },
    });

    console.log('✅ Sample user created:', user.email);
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
