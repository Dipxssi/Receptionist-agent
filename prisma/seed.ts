import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.callLog.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.visitor.deleteMany();
  await prisma.employee.deleteMany();
  console.log('✓ Cleared existing data');

  // Load JSON data or use hardcoded fallback
  let jsonData;
  try {
    const dataPath = path.join(process.cwd(), 'src', 'lib', 'data.json');
    jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log('Loaded data from JSON file');
  } catch {
    console.log('JSON file not found, using hardcoded data');
    jsonData = {
      employees: [
        { id: 'emp_001', name: 'Sarah Johnson', department: 'Engineering', floor: '3rd', room: '305', status: 'available' },
        { id: 'emp_002', name: 'Lisa Rodriguez', department: 'HR', floor: '2nd', room: '201', status: 'available' },
        { id: 'emp_003', name: 'David Park', department: 'Marketing', floor: '4th', room: '412', status: 'available' }
      ],
      visitors: [
        { id: 'vis_001', name: 'John Smith', appointment: true, expectedEmployee: 'Sarah Johnson', phoneNumber: '+1234567890' },
        { id: 'vis_002', name: 'Mike Chen', appointment: false, expectedEmployee: 'Lisa Rodriguez', phoneNumber: '+1234567891' }
      ],
      bots: [
        { id: 'bot_001', name: 'Main Reception Agent', uid: 'main_reception_001', prompt: 'Professional AI receptionist for Attack Agent office.', status: 'active', openmic_uid: 'openmic_reception_agent_123' },
        { id: 'bot_002', name: 'HR Assistant Bot', uid: 'hr_assistant_001', prompt: 'HR department specialized assistant.', status: 'inactive', openmic_uid: 'openmic_hr_assistant_456' },
        { id: 'bot_003', name: 'Customer Service Bot', uid: 'customer_service_001', prompt: 'Customer service bot.', status: 'active', openmic_uid: null }
      ],
      callLogs: [
        { botId: 'bot_001', visitor: 'John Smith', employee: 'Sarah Johnson', department: 'Engineering', duration: 45, transcript: 'Visitor asked for Sarah Johnson.', status: 'completed' },
        { botId: 'bot_001', visitor: 'Mike Chen', employee: 'Lisa Rodriguez', department: 'HR', duration: 62, transcript: 'Visitor looking for Lisa Rodriguez.', status: 'completed' },
        { botId: 'bot_002', visitor: 'Emma Wilson', employee: 'David Park', department: 'Marketing', duration: 38, transcript: 'Quick inquiry about marketing department.', status: 'completed' }
      ]
    };
  }

  // Create employees
  console.log('Creating employees...');
  for (const emp of jsonData.employees) {
    await prisma.employee.create({ data: emp });
  }

  // Create visitors
  console.log('Creating visitors...');
  for (const visitor of jsonData.visitors) {
    await prisma.visitor.create({ data: visitor });
  }

  // Create bots
  console.log('Creating bots...');
  for (const bot of jsonData.bots) {
    await prisma.bot.create({
      data: {
        id: bot.id,
        name: bot.name,
        uid: bot.uid || `uid_${bot.id}`,
        prompt: bot.prompt,
        status: bot.status || 'active',
        openmic_uid: bot.openmic_uid || null,
        createdAt: bot.createdAt ? new Date(bot.createdAt) : new Date(),
        updatedAt: bot.updatedAt ? new Date(bot.updatedAt) : new Date()
      }
    });
  }

  // Create call logs
  console.log('Creating call logs...');
  for (const call of jsonData.callLogs) {
    await prisma.callLog.create({
      data: {
        callId: `seed_call_${Math.random().toString(36).substr(2, 9)}`, // generate unique callId
        botId: call.botId,
        visitor: call.visitor,
        employee: call.employee,
        department: call.department,
        arrivalTime: call.arrivalTime ? new Date(call.arrivalTime) : new Date(),
        duration: call.duration || 0,
        transcript: call.transcript || null,
        status: call.status || 'completed'
      } as Prisma.CallLogUncheckedCreateInput
    });
  }

  console.log('Database seeded successfully!');
  console.log(`✓ Employees: ${jsonData.employees.length}, Visitors: ${jsonData.visitors.length}, Bots: ${jsonData.bots.length}, CallLogs: ${jsonData.callLogs.length}`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
