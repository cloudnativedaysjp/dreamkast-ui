import React, { ReactNode } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import * as Styled from './styled'
import Head from 'next/head'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'

type Props = {
  children?: ReactNode
  title?: string
}

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
  },
}))

export const Layout: React.FC<Props> = ({
  children,
  title = 'This is the default title',
}) => {
  const classes = useStyles()
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <AppBar position="static">
          <Styled.Header>
            <Typography variant="h6" className={classes.title}>
              New Dreamkast
            </Typography>
            <Button color="inherit">Login</Button>
          </Styled.Header>
        </AppBar>
      </header>
      {children}
      <footer>
        <hr />
        <span>CloudNative Days</span>
      </footer>
    </div>
  )
}
