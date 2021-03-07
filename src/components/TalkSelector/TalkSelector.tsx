import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import { Talk } from '../../client-axios'
import dayjs from 'dayjs'

type Props = {
  selectedTrackId?: number
  selectedTalk?: Talk
  talks: Talk[]
  selectTalk: (talk: Talk) => void
}

interface TalkWithAvailable extends Talk {
  available: boolean
}

const isAvailable = (
  now: number,
  startTime: string,
  conferanceDayDate?: string,
) => {
  if (!conferanceDayDate) return true
  const startDate = `${conferanceDayDate} ${dayjs(startTime).format('HH:mm')}`
  return now - dayjs(startDate).unix() >= 0
}

export const TalkSelector: React.FC<Props> = ({
  selectedTrackId,
  selectedTalk,
  talks,
  selectTalk,
}) => {
  const [talksWithAvailableState, setTalksWithAvailableState] = useState<
    TalkWithAvailable[]
  >([])
  const [now, setNow] = useState<number>(dayjs().unix())
  const [id, setId] = useState<number>()

  useEffect(() => {
    if (!process.browser) return
    setId(
      window.setInterval(() => {
        setNow(dayjs().unix())
      }, 1000),
    )
    return window.clearInterval(id)
  }, [])

  useEffect(() => {
    setTalksWithAvailableState(
      talks.map((talk) => {
        return {
          ...talk,
          available: isAvailable(now, talk.startTime, talk.conferenceDayDate),
        }
      }),
    )
  }, [talks, now])

  return (
    <Styled.Container>
      <Styled.Title>このトラックのセッション</Styled.Title>
      <Styled.List>
        {talksWithAvailableState.map((talk) => {
          if (talk.trackId == selectedTrackId) {
            return (
              <Styled.Item
                button
                key={talk.id}
                disabled={!talk.available}
                selected={talk.id === selectedTalk?.id}
                onClick={() => selectTalk(talk)}
              >
                <Styled.Text>
                  {talk.onAir && <Styled.Live>LIVE</Styled.Live>}{' '}
                  {dayjs(talk.startTime).format('HH:mm')}-
                  {dayjs(talk.endTime).format('HH:mm')}
                  <br />
                  {talk.title}
                </Styled.Text>
              </Styled.Item>
            )
          }
        })}
      </Styled.List>
    </Styled.Container>
  )
}
