import React from 'react'
import { List } from '@material-ui/core'
import { ListItemText } from '@material-ui/core'
import { Talk } from '../client-axios'

type Props = {
  talk?: Talk
}

const Chat: React.FC<Props> = ({ talk }) => (
  <div>
    <h2>Chat / QA</h2>
    <h3>{talk?.title}</h3>
    <List>
      <ListItemText primary="foooo" />
      <ListItemText primary="bar" />
      <ListItemText primary="baz" />
      <ListItemText primary="hoge" />
      <ListItemText primary="fuga" />
      <ListItemText primary="piyo" />
      <ListItemText primary="fooo" />
    </List>
  </div>
)

export default Chat
