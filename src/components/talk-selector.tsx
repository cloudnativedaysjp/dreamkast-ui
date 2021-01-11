import React from 'react'
//import { makeStyles } from '@material-ui/core/styles';
import { Talk } from '../interfaces'
import { List } from '@material-ui/core'
import { ListItem } from '@material-ui/core'
import { ListItemText } from '@material-ui/core'

type Props = {
  selectedTrackId: string
  selectedTalk: Talk
  talks: Talk[]
  selectTalk: Function
}

// const useStyles = makeStyles({
//   player: {
//     //backgroundColor: "#CC0",
//   },
//   chat: {
//     //backgroundColor: "#CC0",
//   }
// });

const TalkSelector: React.FC<Props> = ({
  selectedTrackId,
  selectedTalk,
  talks,
  selectTalk,
}) => {
  // const classes = useStyles();

  return (
    <List component="nav">
      {talks.map((talk) => {
        if (talk.trackId == selectedTrackId) {
          return (
            <ListItem
              button
              selected={talk.id === selectedTalk.id}
              onClick={(event) => selectTalk(event, talk)}
            >
              <ListItemText inset primary={talk.title} />
            </ListItem>
          )
        }
      })}
    </List>
  )
}

export default TalkSelector
