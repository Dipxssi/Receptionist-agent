import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function findVisitorByPhone(phoneNumber: string) {
  return await prisma.visitor.findUnique({
    where: { phoneNumber }
  });
}

export async function findEmployeeByName(name: string) {
  return await prisma.employee.findFirst({
    where: {
      name: {
        contains: name,
        mode: 'insensitive'
      }
    }
  });
}

export async function getBots() {
  try {
    const bots = await prisma.bot.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return bots;
  } catch (error) {
    console.error('Error in getBots:', error);
    return [];
  }
}

export async function createBot(data: { name: string; openmic_uid?: string }) {
  try {
    const bot = await prisma.bot.create({
      data: {
        name: data.name,
        uid: `uid_${Date.now()}`, 
        openmic_uid: data.openmic_uid || null,
        prompt: `AI receptionist bot: ${data.name}`,
        status: 'active'
      }
    });
    return bot;
  } catch (error) {
    console.error('Error in createBot:', error);
    throw error;
  }
}

export async function getEmployees() {
  return await prisma.employee.findMany();
}

export async function getVisitors() {
  return await prisma.visitor.findMany();
}

export async function getCallLogs() {
  return await prisma.callLog.findMany({
    include: { bot: true }
  });
}

export async function addCallLog(callLog:Prisma.CallLogCreateInput ) {
  return await prisma.callLog.create({
    data: callLog
  });
}

