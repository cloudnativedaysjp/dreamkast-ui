import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { NextPageContext } from 'next'
import { createWrapper, Context } from 'next-redux-wrapper'
import { dreamkastApi } from '../generated/dreamkast-api.generated'
import auth from './auth'
import settings from './settings'

const makeStore = (_: Context) => {
  const store = configureStore({
    reducer: {
      [dreamkastApi.reducerPath]: dreamkastApi.reducer,
      [auth.name]: auth.reducer,
      [settings.name]: settings.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(dreamkastApi.middleware),
  })
  setupListeners(store.dispatch)
  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const wrapper = createWrapper(makeStore, {
  serializeState: (state) =>
    typeof window === 'undefined' ? JSON.stringify(state) : state,
  deserializeState: (state) =>
    typeof state === 'string' ? JSON.parse(state) : state,
  // debug: true,
})

export const getInitialPageProps: typeof wrapper['getInitialPageProps'] = (
  f,
) => {
  const _getInitialPageProps = wrapper.getInitialPageProps(f)
  return async (ctx: NextPageContext) => {
    const props = await _getInitialPageProps?.(ctx)
    if (props.initialState) {
      const { initialState: _initialState, ...restProps } = props
      return restProps
    }
    return props
  }
}
