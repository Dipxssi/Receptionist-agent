import { PrismaClient } from '@prisma/client';

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
  return await prisma.bot.findMany();
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

export async function addCallLog(callLog: any) {
  return await prisma.callLog.create({
    data: callLog
  });
}

