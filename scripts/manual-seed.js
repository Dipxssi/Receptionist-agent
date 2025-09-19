const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    // Read JSON data
    const dataPath = path.join(process.cwd(), 'src', 'lib', 'data.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log('Seeding database...');

    // Clear existing data
    await prisma.callLog.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.visitor.deleteMany();
    await prisma.employee.deleteMany();

    console.log('Cleared existing data');

    console.log('Creating employees...');
    for (const employee of jsonData.employees) {
      await prisma.employee.create({
        data: employee
      });
    }

     
    console.log('Creating visitors...');
    for (const visitor of jsonData.visitors) {
      await prisma.visitor.create({
        data: visitor
      });
    }

    
    console.log('Creating bots...');
    for (const bot of jsonData.bots) {
      await prisma.bot.create({
        data: {
          ...bot,
          uid: bot.uid || '',
          createdAt: new Date(bot.createdAt),
          updatedAt: new Date(bot.updatedAt)
        }
      });
    }

    console.log(' Database seeded successfully!');
  } catch (error) {
    console.error(' Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
