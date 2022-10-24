import { BaseQueryEnhancer } from '@reduxjs/toolkit/dist/query'
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { MaybePromise } from '@reduxjs/toolkit/dist/query/tsHelpers'

export type ReauthOptions = Record<string, never>

export const reauth: BaseQueryEnhancer<
  unknown,
  ReauthOptions,
  ReauthOptions | void
> = (baseQuery, _) => {
  return async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions)
    if (result.error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (result.meta as any).response.status
      if (status === 401) {
        console.warn('Redirect to conference top since unauthenticated')
        // TODO resolve dreamkast URL in an appropriate way
        window.location.href = `${window.location.href.replace(/\/ui/g, '')}`
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result as MaybePromise<QueryReturnValue<any, any, any>>
  }
}
