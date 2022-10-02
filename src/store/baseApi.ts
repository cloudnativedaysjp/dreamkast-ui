import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { retry } from './retry'
import { RootState } from './index'

const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token

      // TODO reconsider that API call without token should be passed
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  {
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
  },
)

export const baseApi = createApi({
  baseQuery,
  endpoints: () => ({}),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 300,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
})

export type DreamkastEndpointBuilder = Parameters<
  Parameters<typeof baseApi['injectEndpoints']>[0]['endpoints']
>[0]
