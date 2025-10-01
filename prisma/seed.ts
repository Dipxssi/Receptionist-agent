import { PrismaClient } from '@prisma/client';
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

  // Load JSON data if exists
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
        { id: 'bot_001', name: 'Main Reception Agent', uid: 'main_reception_001', prompt: 'Professional AI receptionist.', status: 'active', openmic_uid: 'openmic_reception_agent_123' },
        { id: 'bot_002', name: 'HR Assistant Bot', uid: 'hr_assistant_001', prompt: 'HR assistant bot.', status: 'inactive', openmic_uid: 'openmic_hr_assistant_456' },
        { id: 'bot_003', name: 'Customer Service Bot', uid: 'customer_service_001', prompt: 'Customer service bot.', status: 'active', openmic_uid: null }
      ],
      callLogs: [
        { callId: 'seed_call_001', botId: 'bot_001', visitor: 'John Smith', employee: 'Sarah Johnson', department: 'Engineering', duration: 45, transcript: 'Visitor asked for Sarah Johnson. Provided location: 3rd floor, room 305.', status: 'completed' },
        { callId: 'seed_call_002', botId: 'bot_001', visitor: 'Mike Chen', employee: 'Lisa Rodriguez', department: 'HR', duration: 62, transcript: 'Visitor looking for Lisa Rodriguez. Directed to HR department, 2nd floor.', status: 'completed' },
        { callId: 'seed_call_003', botId: 'bot_002', visitor: 'Emma Wilson', employee: 'David Park', department: 'Marketing', duration: 38, transcript: 'Quick inquiry about marketing department location.', status: 'completed' }
      ]
    };
  }

  // Create Employees
  for (const employee of jsonData.employees) {
    await prisma.employee.create({
      data: {
        id: employee.id,
        name: employee.name,
        department: employee.department,
        floor: employee.floor,
        room: employee.room,
        status: employee.status ?? 'available'
      }
    });
  }

  // Create Visitors
  for (const visitor of jsonData.visitors) {
    await prisma.visitor.create({
      data: {
        id: visitor.id,
        name: visitor.name,
        appointment: visitor.appointment,
        expectedEmployee: visitor.expectedEmployee,
        phoneNumber: visitor.phoneNumber
      }
    });
  }

  // Create Bots
  for (const bot of jsonData.bots) {
    await prisma.bot.create({
      data: {
        id: bot.id,
        name: bot.name,
        uid: bot.uid ?? `uid_${bot.id}`,
        prompt: bot.prompt,
        status: bot.status ?? 'active',
        openmic_uid: bot.openmic_uid ?? null,
        createdAt: bot.createdAt ? new Date(bot.createdAt) : new Date(),
        updatedAt: bot.updatedAt ? new Date(bot.updatedAt) : new Date()
      }
    });
  }

  // Create Call Logs
  for (const callLog of jsonData.callLogs) {
    await prisma.callLog.create({
      data: {
        callId: callLog.callId,
        botId: callLog.botId,
        visitor: callLog.visitor,
        employee: callLog.employee,
        department: callLog.department,
        arrivalTime: callLog.arrivalTime ? new Date(callLog.arrivalTime) : new Date(),
        duration: callLog.duration ?? 0,
        transcript: callLog.transcript ?? null,
        status: callLog.status ?? 'completed'
      }
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Employees: ${jsonData.employees.length}, Visitors: ${jsonData.visitors.length}, Bots: ${jsonData.bots.length}, Call Logs: ${jsonData.callLogs.length}`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
