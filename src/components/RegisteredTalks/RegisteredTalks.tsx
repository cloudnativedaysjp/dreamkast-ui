import React from 'react'
import 'dayjs/locale/ja'
import * as Styled from './styled'
import dayjs from 'dayjs'
import { Event, RegisteredTalk } from '../../generated/dreamkast-api.generated'
import { settingsSelector } from '../../store/settings'
import { useSelector } from 'react-redux'
import { CardContent, Link, Typography } from '@material-ui/core'

type Props = {
  event: Event
}

export const RegisteredTalks: React.FC<Props> = ({ event }) => {
  const settings = useSelector(settingsSelector)
  const conferenceDays = event.conferenceDays?.filter((day) => {
    return !day.internal
  })

  const talkInfo = (talk: RegisteredTalk) => {
    const start = dayjs(talk.talkStartTime).format('HH:mm')
    const end = dayjs(talk.talkEndTime).format('HH:mm')
    return `${start}-${end} Track${talk.trackName} / ${talk.roomName}`
  }

  if (conferenceDays) {
    return (
      <Styled.Container>
        {conferenceDays?.map((day) => {
          const talks = settings.profile.registeredTalks?.filter((talk) => {
            return talk.conferenceDay == day.date
          })
          return (
            <div>
              <Typography variant="h6">{day.date}</Typography>
              {talks?.map((talk) => {
                return (
                  <Styled.TalkContainer>
                    <CardContent>
                      <Styled.TalkInfo color="textSecondary" gutterBottom>
                        {talkInfo(talk)}
                      </Styled.TalkInfo>
                      <Link href={`/${event.abbr}/talks/${talk.talkId}`}>
                        <Typography variant="h6">{talk.talkTitle}</Typography>
                      </Link>
                      <Styled.Pos color="textSecondary">
                        {talk.talkSpeakers
                          ?.map((speaker) => {
                            return `${speaker.name} (@${speaker.twitterId})`
                          })
                          .join(' / ')}
                      </Styled.Pos>
                    </CardContent>
                  </Styled.TalkContainer>
                )
              })}
            </div>
          )
        })}
      </Styled.Container>
    )
  } else {
    return <div></div>
  }
}
