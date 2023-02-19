import React, { useEffect } from 'react'
import * as Styled from './styled'
import { Track } from '../../generated/dreamkast-api.generated'
import { Grid } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'
import dayjs from 'dayjs'

type Props = {
  tracks: Track[]
}

export const LiveTrackList: React.FC<Props> = ({ tracks }) => {
  const { talks } = useSelector(settingsSelector)

  const data = tracks
    .map((tr) => {
      const talkId = tr.onAirTalk
        ? ((tr.onAirTalk as any)?.talk_id as string)
        : ''
      return {
        track: tr,
        talk: talks[talkId],
      }
    })
    .filter(({ talk }) => !!talk)

  return (
    <Styled.Container>
      <Styled.InnerContainer>
        {data.map(({ talk, track }) => (
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="flex-start"
          >
            <Grid item xs={3}>
              ID={track.id}
            </Grid>
            <Grid item>
              {dayjs(talk.startTime).format('HH:mm')}-
              {dayjs(talk.endTime).format('HH:mm')}
              <br />
              {talk.title}
              <br />
              {talk.speakers?.map((s) => s.name).join(', ')}
            </Grid>
          </Grid>
        ))}
      </Styled.InnerContainer>
    </Styled.Container>
  )
}
