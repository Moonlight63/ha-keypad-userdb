import { User } from '@prisma/client'
import type { H3Event } from 'h3'

import { defineEventHandler } from 'h3'

async function fireEvent(name: string) {
  const config = useRuntimeConfig()

  // if (config.haToken) {
  console.log("🚀 ~ file: find.get.ts:28 ~ defineEventHandler ~ config.haToken:", config.haToken)

  console.log("🚀 ~ file: find.get.ts:25 ~ fireEvent ~ process.env.SUPERVISOR_TOKEN:", process.env.SUPERVISOR_TOKEN)

  const res = await $fetch('http://supervisor/core/api/events/keypaddb.user_scanned', {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${process.env.SUPERVISOR_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: {
      name: name
    }
  })

  console.log("🚀 ~ file: find.get.ts:23 ~ fireEvent ~ res:", res)

  // }
}

export default defineEventHandler(async (event: H3Event) => {
  const prisma = event.context.prisma
  const query = await getQuery(event)

  let result

  if (query.code) {
    // console.log("🚀 ~ file: find.get.ts:12 ~ defineEventHandler ~ query.code:", query.code)

    switch (query.code.toString().length) {
      case 4:
        result = (await prisma.user.findFirst({ where: { code: { code: query.code as string } } })) || false
        break;
      case 6:
        result = (await prisma.print.findUnique({ where: { code: query.code as string }, include: { user: true } }))?.user || false
        break;
      case 8:
        result = (await prisma.user.findFirst({ where: { tag: { code: query.code as string } } })) || false
        break;
      default:
        break;
    }
    // if (result && process.env.SUPERVISOR_TOKEN) {
    //   await fireEvent(result as string)
    // }
    return result && (result as User).active ? (result as User).name : false
  }
  return false

  // return prisma.user.findMany({include: {code: {select: {code:true}}, prints: {select: {code:true}}, tag: {select: {code:true}}}})
})