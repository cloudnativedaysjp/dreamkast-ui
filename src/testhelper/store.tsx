// ref: https://redux.js.org/usage/writing-tests

import React, { PropsWithChildren } from 'react'
import { combineReducers, PreloadedState } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { dreamkastApi } from '../generated/dreamkast-api.generated'
import auth from '../store/auth'
import settings from '../store/settings'
import appData from '../store/appData'
import { setupListeners } from '@reduxjs/toolkit/query'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { RootState } from '../store'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(dreamkastApi.middleware),
    preloadedState,
  })
  setupListeners(store.dispatch)
  return store
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      auth: auth.getInitialState(),
      settings: settings.getInitialState(),
      appData: appData.getInitialState(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      api: {} as any,
    },
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions,
) {
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export function renderWithApolloClient(
  ui: React.ReactElement,
  renderOptions?: RenderOptions,
) {
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    const client = new ApolloClient({
      uri: 'http://localhost:3001',
      cache: new InMemoryCache(),
    })
    return <ApolloProvider client={client}>{children}</ApolloProvider>
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

const rootReducer = combineReducers({
  [dreamkastApi.reducerPath]: dreamkastApi.reducer,
  [auth.name]: auth.reducer,
  [settings.name]: settings.reducer,
  [appData.name]: appData.reducer,
})

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: ReturnType<typeof setupStore>
}
