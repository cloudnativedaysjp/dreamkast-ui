import {
  fetchBaseQuery,
  createApi,
  FetchArgs,
  BaseQueryFn,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { retry } from './retry'
import { ENV } from './../config'
import { reauth } from './reauth'

const createBaseQuery = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({ baseUrl })

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
  const apiBaseUrl = ENV.DREAMKAST_API_BASE_URL
  const baseQuery = createBaseQuery(apiBaseUrl)
  return baseQuery(args, api, extraOptions)
}

export const baseDkfApi = createApi({
  baseQuery: dynamicBaseQuery,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 300,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
})

export type DkfEndpointBuilder = Parameters<
  Parameters<typeof baseDkfApi['injectEndpoints']>[0]['endpoints']
>[0]
