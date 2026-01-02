import React, { PropsWithChildren, useEffect } from 'react'
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
import { setApiBaseUrl, setDkUrl, setWsBaseUrl } from '../store/auth'
import { ENV, validateEnv } from '../config'
import { PrivateCtxProvider } from '../context/private'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { AuthProvider } from '../context/auth'

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
const AppComponent: any = ({ children }: PropsWithChildren) => {
  // Remove the server-side injected CSS.(https://material-ui.com/guides/server-rendering/)
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-MWQZPVN' })
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

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

type RootAppProps = AppProps & { env: typeof ENV }
const RootApp = ({ Component, pageProps, env }: RootAppProps) => {
  // inject env vars to redux
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setApiBaseUrl(env.NEXT_PUBLIC_API_BASE_URL))
    dispatch(setWsBaseUrl(env.NEXT_PUBLIC_DK_URL))
    dispatch(setDkUrl(env.NEXT_PUBLIC_DK_URL))
  }, [])

  const client = new ApolloClient({
    uri: new URL('query', env.NEXT_PUBLIC_WEAVER_URL).href,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'ignore', // エラーを無視してアプリを続行
        fetchPolicy: 'cache-and-network',
      },
      watchQuery: {
        errorPolicy: 'ignore', // エラーを無視してアプリを続行
        fetchPolicy: 'cache-and-network',
      },
      mutate: {
        errorPolicy: 'ignore', // エラーを無視してアプリを続行
      },
    },
    // Apollo Clientのエラーを抑制（GraphQLクエリが失敗してもアプリ全体を停止しない）
    onError: ({ networkError, graphQLErrors }) => {
      // エラーをログに記録するが、アプリを停止しない
      if (networkError) {
        console.warn(
          'Apollo Client network error (non-critical, ignored):',
          networkError,
        )
      }
      if (graphQLErrors) {
        console.warn(
          'Apollo Client GraphQL errors (non-critical, ignored):',
          graphQLErrors,
        )
      }
    },
  })

  return (
    <>
      <PrivateCtxProvider env={env}>
        <AppComponent>
          <ApolloProvider client={client}>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </ApolloProvider>
        </AppComponent>
      </PrivateCtxProvider>
    </>
  )
}

RootApp.getInitialProps = wrapper.getInitialAppProps(
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

export default wrapper.withRedux(RootApp)
