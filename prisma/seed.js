import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const tradeSchoolsData = [
  {
    name: "Lincoln Tech",
    location: "Multiple Locations",
    programs: ["Automotive Technology", "HVAC", "Electrical Technology", "Welding"],
    website: "https://www.lincolntech.edu",
    accredited: true
  },
  {
    name: "Universal Technical Institute",
    location: "Nationwide",
    programs: ["Automotive", "Diesel & Truck", "Motorcycle", "Marine", "CNC Machining"],
    website: "https://www.uti.edu",
    accredited: true
  },
  {
    name: "Mike Rowe WORKS Foundation",
    location: "Various Partners",
    programs: ["Skilled Trades", "Construction", "Manufacturing"],
    website: "https://www.mikeroweworks.org",
    accredited: true
  },
  {
    name: "Tulsa Welding School",
    location: "Tulsa, Jacksonville, Houston",
    programs: ["Welding", "Pipefitting", "HVAC/R", "Electrical"],
    website: "https://www.tws.edu",
    accredited: true
  },
  {
    name: "Advanced Technology Institute",
    location: "Virginia Beach, VA",
    programs: ["Automotive", "HVAC", "Industrial Maintenance", "Medical"],
    website: "https://www.auto.edu",
    accredited: true
  },
  {
    name: "Midwest Technical Institute",
    location: "Illinois",
    programs: ["Automotive", "Diesel", "Collision Repair", "Industrial Maintenance"],
    website: "https://www.midwesttech.edu",
    accredited: true
  },
  {
    name: "Porter and Chester Institute",
    location: "Connecticut, Massachusetts",
    programs: ["Automotive", "HVAC/R", "Electrical", "Plumbing", "CAD"],
    website: "https://www.porterchester.edu",
    accredited: true
  },
  {
    name: "New England Tractor Trailer Training School",
    location: "Multiple Locations",
    programs: ["CDL Training", "Truck Driving"],
    website: "https://www.nettts.com",
    accredited: true
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.tradeSchool.deleteMany({});
  console.log('✨ Cleared existing trade schools');

  // Insert seed data
  for (const school of tradeSchoolsData) {
    await prisma.tradeSchool.create({
      data: school
    });
  }

  console.log(`✅ Seeded ${tradeSchoolsData.length} trade schools`);

  // Create default user if it doesn't exist
  const defaultUsername = 'admin';
  const defaultPassword = 'password123';

  const existingUser = await prisma.user.findUnique({
    where: { username: defaultUsername }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await prisma.user.create({
      data: {
        username: defaultUsername,
        password: hashedPassword
      }
    });
    console.log(`✅ Created default user: ${defaultUsername}`);
    console.log(`   Username: ${defaultUsername}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log('   ⚠️  Change this password in production!');
  } else {
    console.log(`ℹ️  User ${defaultUsername} already exists, skipping user creation`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

