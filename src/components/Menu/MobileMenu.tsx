import React from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import * as Styled from './styled'

type Props = {
  url: string
}

export const MobileMenu: React.FC<Props> = ({ url }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Styled.MobileMenu>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <a href={'#booths'}>Booths</a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a href={'/cndo2021/timetables'}>Timetable</a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a href={url}>Logout</a>
        </MenuItem>
      </Menu>
    </Styled.MobileMenu>
  )
}
