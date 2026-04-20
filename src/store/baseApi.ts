import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { retry } from './retry'
import { reauth } from './reauth'

type AuthStoreState = {
  auth: {
    token: string
    apiBaseUrl: string
  }
}

type HydrateAction = {
  type: typeof HYDRATE
  payload: Record<string, unknown>
}

const createBaseQuery = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AuthStoreState).auth.token

      // TODO reconsider that API call without token should be passed
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  })

  return retry(reauth(baseQuery), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    maxRetries: 3 as any,
    // 400番台はretryしません. 以下のPRがマージされたら、自前のretryを廃止します
    // https://github.com/reduxjs/redux-toolkit/pull/2239
    retryCondition: (error, _, { attempt, extraOptions: { maxRetries } }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status: number = error.status || (error as any).error.originalStatus

      return (
        !(400 <= status && status < 500) && attempt < (maxRetries as number)
      )
    },
  })
}

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const apiBaseUrl = (api.getState() as AuthStoreState).auth.apiBaseUrl
  const baseQuery = createBaseQuery(apiBaseUrl)
  return baseQuery(args, api, extraOptions)
}

export const baseApi = createApi({
  baseQuery: dynamicBaseQuery,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 300,
  // next-redux-wrapper serializes the api slice into HYDRATE payload.
  extractRehydrationInfo(action, { reducerPath }): any {
    if (action.type === HYDRATE) {
      const hydrateAction = action as HydrateAction
      return hydrateAction.payload[reducerPath]
    }
  },
})

export type DreamkastEndpointBuilder = Parameters<
  Parameters<(typeof baseApi)['injectEndpoints']>[0]['endpoints']
>[0]
