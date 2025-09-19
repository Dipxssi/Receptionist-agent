import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(process.cwd(), 'src', 'lib', 'data.json');
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(' Seeding database...');

  
  await prisma.callLog.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.visitor.deleteMany();
  await prisma.employee.deleteMany();

  console.log(' Cleared existing data');

  
  console.log(' Creating employees...');
  for (const employee of jsonData.employees) {
    await prisma.employee.create({
      data: {
        id: employee.id,
        name: employee.name,
        department: employee.department,
        floor: employee.floor,
        room: employee.room,
        status: employee.status,
      },
    });
  }

  
  console.log('Creating visitors...');
  for (const visitor of jsonData.visitors) {
    await prisma.visitor.create({
      data: {
        id: visitor.id,
        name: visitor.name,
        appointment: visitor.appointment,
        expectedEmployee: visitor.expectedEmployee,
        phoneNumber: visitor.phoneNumber,
      },
    });
  }

 
  console.log('Creating bots...');
  for (const bot of jsonData.bots) {
    await prisma.bot.create({
      data: {
        id: bot.id,
        name: bot.name,
        uid: bot.uid || '',
        prompt: bot.prompt,
        createdAt: new Date(bot.createdAt),
        updatedAt: new Date(bot.updatedAt),
      },
    });
  }

  if (jsonData.callLogs && jsonData.callLogs.length > 0) {
    console.log('Creating call logs...');
    for (const callLog of jsonData.callLogs) {
      await prisma.callLog.create({
        data: {
          id: callLog.id,
          botId: callLog.botId,
          visitor: callLog.visitor,
          employee: callLog.employee,
          department: callLog.department,
          arrivalTime: new Date(callLog.arrivalTime),
          duration: callLog.duration,
          transcript: callLog.transcript || null,
          status: callLog.status,
        },
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(' Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
