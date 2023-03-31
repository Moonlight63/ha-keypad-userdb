import { PrismaClient } from "@prisma/client";
export let prisma: PrismaClient
export default defineNitroPlugin(async (nitro) => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
})