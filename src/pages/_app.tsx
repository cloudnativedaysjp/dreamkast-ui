import { useEffect } from 'react'
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
const AppComponent: any = ({ Component, pageProps }: AppProps) => {
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
            <Component {...pageProps} />
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

export default wrapper.withRedux(AppComponent)
