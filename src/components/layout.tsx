import React, { ReactNode } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Head from 'next/head'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

type Props = {
  children?: ReactNode
  title?: string
  classes?
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


const Layout = ({ children, title = 'This is the default title', classes = useStyles() }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Dreamkast
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
    </header>
    {children}
    <footer>
      <hr />
      <span>CloudNative Days</span>
    </footer>
  </div>
)

export default Layout
