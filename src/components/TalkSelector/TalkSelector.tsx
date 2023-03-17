import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import * as Styled from './styled'
import dayjs from 'dayjs'
import { Talk } from '../../generated/dreamkast-api.generated'
import { setupDayjs } from '../../util/setupDayjs'
import { LiveModeCheckbox } from './LiveModeCheckbox'
import { NotifyRegisteredTalkStartedCheckbox } from './NotifyRegisteredTalkStartedCheckbox'

setupDayjs()

type Props = {
  selectedTrackId?: number
  selectedTalkId?: number
  talks: Talk[]
  selectTalk: (talkId: number) => void
  small?: boolean
}

export const TalkSelector: React.FC<Props> = (props) => {
  const [now, setNow] = useState<number>(dayjs().unix())

  useEffect(() => {
    if (!process.browser) return
    const id = window.setInterval(() => {
      setNow(dayjs().unix())
    }, 1000)
    return window.clearInterval(id)
  }, [])

  const footer = (
    <>
      <LiveModeCheckbox />
      <Styled.label>ライブセッションに自動遷移</Styled.label>
      <NotifyRegisteredTalkStartedCheckbox />
      <Styled.label>事前登録したセッションに自動遷移</Styled.label>
    </>
  )

  return <PTalkSelector {...props} now={now} footer={footer}></PTalkSelector>
}

type PProps = Props & {
  now: number
  footer?: ReactElement
}

export const PTalkSelector: React.FC<PProps> = ({
  selectedTrackId,
  selectedTalkId,
  talks,
  selectTalk,
  small = false,
  now,
  footer,
}) => {
  const availableTalks = useMemo(
    () => extractAvailableTalks(talks, now),
    [talks, now],
  )

  return (
    <Styled.Container>
      <Styled.Title>このトラックのセッション</Styled.Title>
      <Styled.List height={small ? 350 : 497}>
        {availableTalks.map((talk) => {
          if (talk.trackId == selectedTrackId) {
            return (
              <Styled.Item
                button
                key={talk.id}
                disabled={!talk.available}
                selected={talk.id === selectedTalkId}
                onClick={() => selectTalk(talk.id)}
              >
                <Styled.Text>
                  {talk.onAir && <Styled.Live>LIVE</Styled.Live>}{' '}
                  {dayjs(talk.startTime).tz().format('HH:mm')}-
                  {dayjs(talk.endTime).tz().format('HH:mm')}
                  <br />
                  {talk.title}
                </Styled.Text>
              </Styled.Item>
            )
          }
        })}
      </Styled.List>
      <Styled.Footer>{footer}</Styled.Footer>
    </Styled.Container>
  )
}

type TalkWithAvailable = Talk & {
  available: boolean
}

export const extractAvailableTalks = (
  talks: Talk[],
  now: number,
): TalkWithAvailable[] => {
  return [...talks]
    .sort((n1, n2) => dayjs(n1.startTime).unix() - dayjs(n2.startTime).unix())
    .filter((talk) => talk.showOnTimetable)
    .map((talk) => {
      return {
        ...talk,
        available: isAvailable(now, talk.startTime, talk.conferenceDayDate),
      }
    })
}

const isAvailable = (
  now: number,
  startTime: string,
  conferanceDayDate?: string | null,
) => {
  if (!conferanceDayDate) return true // okui: これであってる？
  const startDate = `${conferanceDayDate} ${dayjs(startTime).format('HH:mm')}`
  return now - dayjs(startDate).unix() >= 0
}
