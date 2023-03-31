/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { initTRPC, TRPCError } from '@trpc/server'
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import superjson from 'superjson'
import { ZodError } from 'zod'
import type { Context } from './context'

export type ValidationIssues = { [key: string]: string | { [key: number]: any } }

export class ValidationError extends Error {
  public readonly issues: ValidationIssues;
  constructor(issues: ValidationIssues) {
    super("Validation Error!");
    this.issues = issues
    this.name = this.constructor.name;
  }
}

const t = initTRPC.context<Context>().create({
  // transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' &&
            error.cause instanceof ZodError
            ? error.cause!.flatten()
            : null,
        validationIssues:
          error.code === 'CONFLICT' &&
            error.cause instanceof ValidationError
            ? error.cause.issues
            : null,
      }
    }
  }
})

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const router = t.router

/**
  * Create an unprotected procedure
  * @see https://trpc.io/docs/v10/procedures
  **/
export const publicProcedure = t.procedure

/**
  * @see https://trpc.io/docs/v10/middlewares
  */
export const middleware = t.middleware

/**
  * @see https://trpc.io/docs/v10/merging-routers
  */
export const mergeRouters = t.mergeRouters