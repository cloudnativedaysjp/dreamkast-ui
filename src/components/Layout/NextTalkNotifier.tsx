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
      <>
        <Button
          style={{ marginRight: '5px' }}
          variant="contained"
          onClick={() => {
            handleTrackChange(track.id)
            closeSnackbar(snackbarId)
          }}
        >
          視聴する
        </Button>
      </>
    )

    enqueueSnackbar(component, { action })
  }, [talk])

  return (
    <SnackbarProvider maxSnack={6} autoHideDuration={10000} preventDuplicate>
      {children}
    </SnackbarProvider>
  )
}
