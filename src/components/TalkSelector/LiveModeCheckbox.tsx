import React from 'react'
import {
  isLiveModeSelector,
  setIsAutoSwitchMode,
  setIsLiveMode,
} from '../../store/settings'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@material-ui/core'

export const LiveModeCheckbox = () => {
  const dispatch = useDispatch()
  const isLiveMode = useSelector(isLiveModeSelector)
  const changeLiveMode = (checked: boolean) => {
    if (!checked) {
      dispatch(setIsAutoSwitchMode(checked))
    }
    dispatch(setIsLiveMode(checked))
  }

  return (
    <Checkbox
      size="small"
      checked={isLiveMode}
      onChange={(_, checked) => changeLiveMode(checked)}
    />
  )
}
