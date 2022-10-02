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
import { useDispatch } from 'react-redux'
import { setToken, setUser } from '../store/auth'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'

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

  // redirectUri={window.location.origin}
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

AppComponent.getInitialProps = wrapper.getInitialAppProps(
  (_store) => async (appContext) => ({
    pageProps: (await App.getInitialProps(appContext)).pageProps,
  }),
)

const WrappedApp = ({ Component, pageProps }: AppProps) => {
  // TODO fix hardcode
  return (
    <>
      <Auth0Provider
        domain={'dreamkast.us.auth0.com'}
        clientId={'0cWWdpGt4CpWjHJ9QIHtPm5GrJLS25lz'}
        redirectUri={'http://localhost:8080/cnsec2022/ui'}
        audience={'https://event.cloudnativedays.jp/'}
      >
        <AppComponent>
          <Component {...pageProps} />
        </AppComponent>
      </Auth0Provider>
    </>
  )
}

export default wrapper.withRedux(WrappedApp)
