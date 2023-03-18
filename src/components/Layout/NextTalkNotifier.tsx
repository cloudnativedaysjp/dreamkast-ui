import React, { PropsWithChildren, useEffect } from 'react'
import {
  nextRegisteredTalkSelector,
  setInitialViewTalk,
  setViewTrackId,
} from '../../store/settings'
import { useDispatch, useSelector } from 'react-redux'
import {
  closeSnackbar,
  enqueueSnackbar,
  SnackbarKey,
  SnackbarProvider,
} from 'notistack'
import dayjs from 'dayjs'
import { Button } from '@material-ui/core'
import styled from 'styled-components'

export const NextTalkNotifier = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch()
  const { talk, track } = useSelector(nextRegisteredTalkSelector)

  const handleTrackChange = (trackId: number) => {
    dispatch(setViewTrackId(trackId))
    dispatch(setInitialViewTalk())
  }

  useEffect(() => {
    if (!talk || !track) {
      return
    }
    console.warn(talk)

    const component = (
      <div>
        <p>事前登録しているセッションが開始されました。</p>
        <p>
          {`トラック${track.name}: `}
          {dayjs(talk.startTime).tz().format('HH:mm')}-
          {dayjs(talk.endTime).tz().format('HH:mm')}
          <br />
          {talk.title}
          <br />
          {talk.speakers?.map((s) => s.name).join(', ')}
        </p>
      </div>
    )

    const action = (snackbarId: SnackbarKey) => (
      <div>
        <div>
          <ActionButton
            variant="contained"
            size="small"
            onClick={() => {
              handleTrackChange(track.id)
              closeSnackbar(snackbarId)
            }}
          >
            視聴する
          </ActionButton>
        </div>
        <div>
          <ActionButton
            variant="contained"
            size="small"
            onClick={() => {
              closeSnackbar(snackbarId)
            }}
          >
            閉じる
          </ActionButton>
        </div>
      </div>
    )

    enqueueSnackbar(component, { action })
  }, [talk])

  return (
    <SnackbarProvider maxSnack={6} autoHideDuration={10000} preventDuplicate>
      {children}
    </SnackbarProvider>
  )
}

const ActionButton = styled(Button)`
  width: 90px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
`
