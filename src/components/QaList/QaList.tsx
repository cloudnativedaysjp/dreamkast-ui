import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import 'dayjs/locale/ja'
import {
  Event,
  Talk,
  useGetApiV1ChatMessagesQuery,
} from '../../generated/dreamkast-api.generated'
import { setupDayjs } from '../../util/setupDayjs'
import { CardContent, Grid } from '@material-ui/core'
import { Chat } from '../Chat'
import dayjs from 'dayjs'
import { settingsSelector } from '../../store/settings'
import { useSelector } from 'react-redux'

setupDayjs()

type Props = {
  event: Event
  talks: Talk[]
}

export const QaList: React.FC<Props> = ({ event, talks }) => {
  const settings = useSelector(settingsSelector)
  const [talk, setTalk] = useState<Talk | undefined>(undefined)
  const { data, isLoading, isError, error } = useGetApiV1ChatMessagesQuery(
    {
      eventAbbr: event.abbr,
      roomType: 'talk',
      profileId: `${settings.profile.id}`,
    },
    { skip: settings.profile.id === 0 },
  )
  const findTalkById = (
    talks: Talk[],
    id: number | undefined,
  ): Talk | undefined => {
    if (!id) {
      return undefined
    }
    return talks.find((talk) => talk.id === id)
  }

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (isError) {
      // TODO error handling
      console.error(error)
      return
    }
    if (!data) {
      return
    }
  }, [data, isLoading, isError])

  if (isLoading || !data) {
    return <div />
  }

  const onSelectTalk = (e: React.MouseEvent<HTMLInputElement>) => {
    const selectedTalkId = e.currentTarget.getAttribute('data-talkId')
    setTalk(findTalkById(talks, Number(selectedTalkId)))
  }

  const talkInfo = (talk: Talk | undefined) => {
    if (!talk) {
      return ''
    }

    const start = dayjs(talk.startTime).tz().format('HH:mm')
    const end = dayjs(talk.endTime).tz().format('HH:mm')
    const day = event.conferenceDays?.find((day) => {
      return day.date === talk.conferenceDayDate
    })
    const speakers = talk.speakers.map((speaker) => speaker.name).join(' / ')
    return `${day?.date} ${start}-${end} ${talk.title} (${speakers})`
  }

  const numberOfQuestions = (talkId: number): number => {
    return data.filter(
      (msg) => msg.roomId === talkId && msg.messageType === 'qa',
    ).length
  }

  const numberOfAnswers = (talkId: number): number => {
    return data.filter(
      (msg) =>
        msg.roomId === talkId &&
        msg.replyTo !== undefined &&
        data.filter((d) => msg.replyTo === d.id).length > 0,
    ).length
  }

  return (
    <Styled.Container>
      <Grid container spacing={1} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} md={4}>
          {talks.map((talk) => {
            if (data.filter((msg) => msg.roomId === talk.id).length > 0) {
              return (
                <Styled.TalkContainer>
                  <CardContent onClick={onSelectTalk} data-talkId={talk.id}>
                    <Styled.TalkInfo color="textSecondary" gutterBottom>
                      {talkInfo(talk)}
                    </Styled.TalkInfo>
                    <p>
                      質問数: {numberOfQuestions(talk.id)}, 回答数:{' '}
                      {numberOfAnswers(talk.id)}
                    </p>
                  </CardContent>
                </Styled.TalkContainer>
              )
            }
          })}
        </Grid>
        <Grid item xs={12} md={8}>
          <Chat event={event} talk={talk} defaultTab={'1'} />
        </Grid>
      </Grid>
    </Styled.Container>
  )
}
