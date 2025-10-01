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

export async function updateBot(
  id: string, 
  data: { 
    name?: string; 
    status?: string; 
    openmic_uid?: string;
    prompt?: string;
  }
) {
  try {
    const bot = await prisma.bot.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.status && { status: data.status }),
        ...(data.openmic_uid !== undefined && { openmic_uid: data.openmic_uid }),
        ...(data.prompt && { prompt: data.prompt }),
        updatedAt: new Date()
      }
    });
    return bot;
  } catch (error) {
    console.error('Error updating bot:', error);
    throw error;
  }
}

export async function deleteBot(id: string) {
  try {
    await prisma.bot.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting bot:', error);
    throw error;
  }
}


export async function getEmployees() {
  return await prisma.employee.findMany();
}

export async function getVisitors() {
  return await prisma.visitor.findMany();
}

export async function getCallLogs(options?: { 
  limit?: number; 
  page?: number; 
  botId?: string; 
}) {
  const { limit = 50, page = 1, botId } = options || {};

  return await prisma.callLog.findMany({
    where: botId ? { botId } : {},   
    include: { bot: true },          
    orderBy: { createdAt: 'desc' },  
    take: limit,                     
    skip: (page - 1) * limit         
  });
}


export async function addCallLog(data: Prisma.CallLogUncheckedCreateInput) {
  return await prisma.callLog.create({
    data
  });
}


export async function getBotById(id: string) {
  try {
    const bot = await prisma.bot.findUnique({
      where: { id },
    });
    return bot;
  } catch (error) {
    console.error('Error fetching bot by ID:', error);
    throw error;
  }
}
