// PRISMA CKient helpeR
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// a shared DB client
// reusable connection
// auto reconnect