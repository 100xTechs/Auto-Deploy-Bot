import { PrismaClient } from "@prisma/client";


export const PORT = process.env.PORT || 3000;
export const API_PREFIX = '/api/v1';
export const prisma = new PrismaClient();