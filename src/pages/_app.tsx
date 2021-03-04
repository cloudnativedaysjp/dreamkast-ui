import React, { useEffect } from 'react'
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

const GlobalStyle = createGlobalStyle`
  html, body {
    padding: 0;
    margin: 0;
    scrollbar-width: none;
    height: 100%;
  }
  body {
    background-image: url('/cndo2021/ui/images/background.jpg');
    background-position: 50%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
  }
  body::-webkit-scrollbar {
    display:none;
  }`

export default function Dreamkast({
  Component,
  pageProps,
}: AppProps): JSX.Element {
  // Remove the server-side injected CSS.(https://material-ui.com/guides/server-rendering/)
  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-MWQZPVN' })
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
