
import { MessageEvent } from "ws";
import { Connection, HassEvent } from "../utils/ha_socket";
import { prisma } from "./0.prisma";
import { User } from "@prisma/client";


export let HAConnection: Connection

async function sendUserFound(user: User) {

  if (HAConnection && user.active) {
    const res = await HAConnection.sendMessagePromise({
      type: "fire_event",
      event_type: "keypaddb.userFound",
      event_data: {
        name: user.name,
        id: user.id
      }
    })
    console.log("🚀 ~ file: ha_socket.ts:18 ~ sendUserFound ~ res:", res)
    return res
  }

}

export default defineNitroPlugin(async () => {

  console.log("HA Socket Plugin");

  if (process.env.SUPERVISOR_TOKEN) {
    console.log("🚀 ~ file: ha_socket.ts:13 ~ process.env.SUPERVISOR_TOKEN:", process.env.SUPERVISOR_TOKEN)
    const auth = createLongLivedTokenAuth(
      "http://supervisor",
      process.env.SUPERVISOR_TOKEN
    );

    HAConnection = await createConnection({ auth });

    const getPin = async (event: HassEvent) => {
      if (event.data.code && prisma) {
        const res = (await prisma.user.findFirst({ where: { code: { code: event.data.code.toString() } } })) || false
        if (res) {
          await sendUserFound(res)
        }
      }
    }

    const getPrint = async (event: HassEvent) => {
      if (event.data.code && prisma) {
        const res = (await prisma.print.findUnique({ where: { code: event.data.code.toString() }, include: { user: true } }))?.user || false
        if (res) {
          await sendUserFound(res)
        }
      }
    }

    const getTag = async (event: HassEvent) => {
      if (event.data.code && prisma) {
        const res = (await prisma.user.findFirst({ where: { tag: { code: event.data.code.toString() } } })) || false
        if (res) {
          await sendUserFound(res)
        }
      }
    }

    HAConnection.subscribeEvents(getPin, "keypaddb.getPin");
    HAConnection.subscribeEvents(getPin, "esphome.keypaddb.getPin");

    HAConnection.subscribeEvents(getPrint, "keypaddb.getPrint");
    HAConnection.subscribeEvents(getPrint, "esphome.keypaddb.getPrint");

    HAConnection.subscribeEvents(getTag, "keypaddb.getTag");
    HAConnection.subscribeEvents(getTag, "esphome.keypaddb.getTag");

    const changeActive = async (event: HassEvent, state: boolean) => {
      if (event.data.id && prisma) {
        const res = await prisma.user.update({ where: { id: event.data.id }, data: { active: state } })
      } else if (event.data.name) {
        const res = await prisma.user.updateMany({ where: { name: event.data.name }, data: { active: state } })
      } else if (event.data.pin) {
        const res = await prisma.code.update({ where: { code: event.data.pin }, data: { user: { update: { active: state } } } })
      } else if (event.data.tag) {
        const res = await prisma.tag.update({ where: { code: event.data.tag }, data: { user: { update: { active: state } } } })
      } else if (event.data.print) {
        const res = await prisma.print.update({ where: { code: event.data.print }, data: { user: { update: { active: state } } } })
      }
      // TODO: Check for error
    }

    HAConnection.subscribeEvents(async (ev: HassEvent) => { await changeActive(ev, false) }, "keypaddb.disableUser")
    HAConnection.subscribeEvents(async (ev: HassEvent) => { await changeActive(ev, true) }, "keypaddb.enableUser")


  }

})
