import { useEffect, useState } from 'react'
import { wrapper } from '../store'
import Head from 'next/head'
import {
  ThemeProvider as SCThemeProvider,
  createGlobalStyle,
} from 'styled-components'
import {
  ThemeProvider as MUIThemeProvider,
  StylesProvider,
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../styles/theme'
import { AppProps } from 'next/app'
import TagManager from 'react-gtm-module'
import App from 'next/app'
import { useDispatch, useSelector } from 'react-redux'
import { setApiBaseUrl, setToken, setUser } from '../store/auth'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { ENV, validateEnv } from '../config'
import { tokenSelector } from '../store/authSelector'

const GlobalStyle = createGlobalStyle`
  html, body {
    padding: 0;
    margin: 0;
    scrollbar-width: none;
    height: 100%;
  }
  body::-webkit-scrollbar {
    display:none;
  }`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppComponent: any = (props: { children: React.ReactElement }) => {
  const { children } = props
  const [_, setError] = useState()
  const dispatch = useDispatch()

  // Remove the server-side injected CSS.(https://material-ui.com/guides/server-rendering/)
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-MWQZPVN' })
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

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

  const token = useSelector(tokenSelector)
  if (!token) {
    return <></>
  }

  return (
    <>
      <Head>
        <title>CloudNative Days player</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <StylesProvider injectFirst>
        <MUIThemeProvider theme={theme}>
          <SCThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyle />
            {children}
          </SCThemeProvider>
        </MUIThemeProvider>
      </StylesProvider>
    </>
  )
}

type WrappedAppProps = AppProps & { env: typeof ENV }
const WrappedApp = ({ Component, pageProps, env }: WrappedAppProps) => {
  const [baseUrl, setBaseUrl] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setApiBaseUrl(env.NEXT_PUBLIC_API_BASE_URL))
  }, [])

  useEffect(() => {
    const url = new URL(env.NEXT_PUBLIC_BASE_PATH, window.location.origin)
    setBaseUrl(url.href)
  }, [setBaseUrl])

  // Only CSR is supported since dynamic host origin resolution cannot be performed in SSR.
  if (!baseUrl) {
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
        <AppComponent>
          <Component {...pageProps} />
        </AppComponent>
      </Auth0Provider>
    </>
  )
}

WrappedApp.getInitialProps = wrapper.getInitialAppProps(
  (_store) => async (appContext) => {
    if (typeof window === 'undefined') {
      validateEnv()
    }
    return {
      pageProps: (await App.getInitialProps(appContext)).pageProps,
      env: { ...ENV },
    }
  },
)

export default wrapper.withRedux(WrappedApp)
