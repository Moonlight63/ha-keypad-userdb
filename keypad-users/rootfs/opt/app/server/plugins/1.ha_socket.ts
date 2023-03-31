
import { MessageEvent } from "ws";
import { Connection, HassEvent } from "../utils/ha_socket";
import { prisma } from "./0.prisma";


export let HAConnection: Connection

async function sendUserFound(name: string) {

  if (HAConnection) {
    const res = await HAConnection.sendMessagePromise({
      type: "fire_event",
      event_type: "keypaddb.userFound",
      event_data: {
        name,
      }
    })
    console.log("🚀 ~ file: ha_socket.ts:18 ~ sendUserFound ~ res:", res)
    return res
  }

}



export default defineNitroPlugin(async (nitro) => {

  console.log("HA Socket Plugin");

  if (process.env.SUPERVISOR_TOKEN) {
    console.log("🚀 ~ file: ha_socket.ts:13 ~ process.env.SUPERVISOR_TOKEN:", process.env.SUPERVISOR_TOKEN)
    const auth = createLongLivedTokenAuth(
      "http://supervisor",
      process.env.SUPERVISOR_TOKEN
    );

    HAConnection = await createConnection({ auth });

    HAConnection.subscribeEvents(async (event: HassEvent) => {
      if (event.data.code && prisma) {
        const res = (await prisma.user.findFirst({ where: { code: { code: event.data.code.toString() } } }))?.name || false
        if (res) {
          await sendUserFound(res)
        }
      }
    }, "keypaddb.getPin");

    HAConnection.subscribeEvents(async (event: HassEvent) => {
      if (event.data.code && prisma) {
        const res = (await prisma.print.findUnique({ where: { code: event.data.code.toString() }, include: { user: true } }))?.user.name || false
        if (res) {
          await sendUserFound(res)
        }
      }
    }, "keypaddb.getPrint");

    HAConnection.subscribeEvents(async (event: HassEvent) => {
      if (event.data.code && prisma) {
        const res = (await prisma.user.findFirst({ where: { tag: { code: event.data.code.toString() } } }))?.name || false
        if (res) {
          await sendUserFound(res)
        }
      }
    }, "keypaddb.getTag");


  }

})