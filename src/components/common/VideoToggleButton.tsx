import React from 'react'
import { Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { setShowVideo, settingsSelector } from '../../store/settings'
import { Videocam, VideocamOff } from '@material-ui/icons'

export const VideoToggleButton = () => {
  const dispatch = useDispatch()
  const settings = useSelector(settingsSelector)
  return (
    <Button
      variant="contained"
      size="small"
      color="primary"
      disableElevation
      startIcon={settings.showVideo ? <VideocamOff /> : <Videocam />}
      onClick={() => dispatch(setShowVideo(!settings.showVideo))}
    >
      {settings.showVideo ? '視聴画面を隠す' : '視聴画面を表示'}
    </Button>
  )
}
