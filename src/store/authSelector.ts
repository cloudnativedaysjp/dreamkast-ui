import { RootState } from './index'
import { createSelector } from 'reselect'

export const authSelector = (state: RootState) => state.auth

export const tokenSelector = createSelector(authSelector, (auth) => auth.token)
export const apiBaseUrlSelector = createSelector(
  authSelector,
  (auth) => auth.apiBaseUrl,
)
