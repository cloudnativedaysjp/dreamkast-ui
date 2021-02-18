import React from 'react'
import * as Styled from './styled'
import { Talk } from '../../client-axios'
import { ListItem } from '@material-ui/core'
import { ListItemText } from '@material-ui/core'

type Props = {
  selectedTrackId: number
  selectedTalk?: Talk
  talks: Talk[]
  selectTalk: (talk: Talk) => void
}

export const TalkSelector: React.FC<Props> = ({
  selectedTrackId,
  selectedTalk,
  talks,
  selectTalk,
}) => {
  // const classes = useStyles();

  return (
    <Styled.Container>
      <Styled.Title>このトラックのセッション</Styled.Title>
      <Styled.List>
        {talks.map((talk) => {
          if (talk.trackId == selectedTrackId) {
            return (
              <ListItem
                button
                key={talk.id}
                selected={talk.id === selectedTalk?.id}
                onClick={() => selectTalk(talk)}
              >
                <ListItemText inset primary={talk.title} />
              </ListItem>
            )
          }
        })}
      </Styled.List>
    </Styled.Container>
  )
}
