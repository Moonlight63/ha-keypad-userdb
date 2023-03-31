import { TRPCError } from '@trpc/server'
import { z, ZodError } from 'zod'
import { publicProcedure, router, ValidationError, ValidationIssues } from '../trpc'

const runtimeValues = useRuntimeConfig().public

// function to deeply remove null or undefined values from an object
export function removeNulls(obj: any): any {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeNulls(obj[key]);
    }
  }
  return obj;
}

export const usersRouter = router({

  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      include: {
        code: { select: { code: true } },
        prints: { select: { code: true } },
        tag: { select: { code: true } }
      }
    })
  }),

  getUser: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: input.id }, include: {
        code: { select: { code: true } },
        prints: { select: { code: true } },
        tag: { select: { code: true } }
      }
    })
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found'
      })
    }
    return user
  }),

  deleteUser: publicProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    try {
      // console.log("🚀 ~ file: users.ts:45 ~ deleteUser:publicProcedure.input ~ input:", input)
      const id = (await ctx.prisma.user.findFirst({ where: { name: input } }))?.id
      // console.log("🚀 ~ file: users.ts:34 ~ deleteUser:publicProcedure.input ~ id:", id)
      if (id) {

        await ctx.prisma.user.delete({ where: { id }, include: { code: true, prints: true, tag: true } })
        return true
      } else {
        return false
      }
    } catch (error) {
      return error
    }
  }),
  addNewUser: publicProcedure
    .input(z.object({
      id: z.string().regex(/^[a-zA-Z0-9]*$/).nullish(),
      name: z.string().nonempty("This field is required.").min(3, "Must be at least 3 characters.").regex(/^[a-zA-Z]/, "Only Letters are allowed."),
      code: z.string().length(parseInt(runtimeValues.pinLength, 10)).nullish().or(z.literal('')).transform(e => e === '' ? undefined : e),
      tag: z.string().length(parseInt(runtimeValues.rfidLength, 10)).nullish().or(z.literal('')).transform(e => e === '' ? undefined : e),
      prints: z.array(z.string().length(parseInt(runtimeValues.printCodeLength, 10))).nullish()
    }))
    .output(z.boolean())
    .mutation(async ({ input, ctx }) => {

      const errors: ValidationIssues = {}

      const filtered = removeNulls(input)

      const promises = Object.keys(filtered).flatMap((key) => {
        if (key == 'name') {
          return (async () => {
            if (await ctx.prisma.user.findFirst({ where: { name: filtered.name } }) !== null)
              errors[key] = `That user already exists.`
          })()
        } else if (key == 'code' || key == 'tag') {
          return (async () => {
            if (await ctx.prisma[key].findUnique({ where: { code: filtered[key]!.toString() } }) !== null)
              errors[key] = `That ${key == 'code' ? 'pin code' : 'rfid tag'} already exists.`
          })()
        } else if (key == 'prints') {
          return input.prints!.map((val, idx) => {
            return (async () => {
              if (await ctx.prisma.print.findUnique({ where: { code: val.toString() } }) !== null) {
                if (!errors.prints) errors.prints = {};
                (errors.prints as Record<number, {}>)[idx] = { code: 'That fingerprint already exists.' }
              }
            })()
          })
        }
      })
      await Promise.all(promises)

      if (Object.keys(errors).length) {
        const err = new ValidationError(errors)
        throw new TRPCError({
          code: 'CONFLICT',
          cause: err,
          message: err.message
        })
      }

      try {
        const user = await ctx.prisma.user.create({ data: { name: input.name, id: input.id ? input.id : undefined } })
        if (input.code) await ctx.prisma.code.create({ data: { code: input.code, user: { connect: { id: user.id } } } })
        if (input.tag) await ctx.prisma.tag.create({ data: { code: input.tag, user: { connect: { id: user.id } } } })
        if (input.prints) {
          for (const key in input.prints) {
            if (Object.prototype.hasOwnProperty.call(input.prints, key)) {
              const element = input.prints[key];
              await ctx.prisma.print.create({ data: { code: element, user: { connect: { id: user.id } } } })
            }
          }
        }
        return true
      } catch (error) {
        // return false
        // throw new TRPCError({
        //   cause: error,
        //   code: 'INTERNAL_SERVER_ERROR',
        //   message: 'Unknown error has occured.'
        // })

        // if (error instanceof TRPCError) {
        //   if (error.cause instanceof ZodError) {
        //     const err = new ValidationError(error.cause.formErrors)
        //     throw new TRPCError({
        //       code: 'CONFLICT',
        //       cause: err,
        //       message: err.message
        //     })
        //   }
        // }
      }
      return false


    })

})