import React from 'react'
import { Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { setShowVideo, showVideoSelector } from '../../store/settings'
import { Videocam, VideocamOff } from '@material-ui/icons'

export const VideoToggleButton = () => {
  const dispatch = useDispatch()
  const showVideo = useSelector(showVideoSelector)
  return (
    <Button
      data-testid={'toggle-btn'}
      variant="contained"
      size="small"
      color="primary"
      disableElevation
      startIcon={showVideo ? <VideocamOff /> : <Videocam />}
      onClick={() => dispatch(setShowVideo(!showVideo))}
    >
      {showVideo ? '視聴画面を隠す' : '視聴画面を表示'}
    </Button>
  )
}
