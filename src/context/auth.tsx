import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ENV } from '../config'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUser } from '../store/auth'
import { authSelector } from '../store/auth'

type Props = {
  env: typeof ENV
}

export const AuthProvider = ({ env, children }: PropsWithChildren<Props>) => {
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    if (!env.NEXT_PUBLIC_BASE_PATH) {
      console.error('Environment variables are not provided as app props.')
      return
    }
    const url = new URL(env.NEXT_PUBLIC_BASE_PATH, window.location.origin)
    setBaseUrl(url.href)
  }, [env])

  // Only CSR is supported since dynamic host origin resolution cannot be performed in SSR.
  if (!baseUrl || !env.NEXT_PUBLIC_BASE_PATH) {
    return <></>
  }
  return (
    <>
      <Auth0Provider
        domain={env.NEXT_PUBLIC_AUTH0_DOMAIN}
        clientId={env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
        redirectUri={baseUrl}
        audience={env.NEXT_PUBLIC_AUTH0_AUDIENCE}
      >
        {children}
      </Auth0Provider>
    </>
  )
}

export const useAccessToken = () => {
  const [_, setError] = useState()
  const dispatch = useDispatch()

  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0()

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (!isAuthenticated) {
      loginWithRedirect().catch((err) => {
        err.message = 'Login with redirect: ' + err.message
        setError(() => {
          throw err
        })
      })
      return
    }
    if (user) {
      dispatch(setUser(user))
    }
    getAccessTokenSilently()
      .then((token) => {
        dispatch(setToken(token))
      })
      .catch((err) => {
        err.message = 'Get token silently: ' + err.message
        setError(() => {
          throw err
        })
      })
  }, [isAuthenticated, isLoading])

  const { token } = useSelector(authSelector)
  return token
}
