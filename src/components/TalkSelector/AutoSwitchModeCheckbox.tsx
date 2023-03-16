import React from 'react'
import {
  isAutoSwitchModeSelector,
  setIsAutoSwitchMode,
  setIsLiveMode,
} from '../../store/settings'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@material-ui/core'

export const AutoSwitchModeCheckbox = () => {
  const dispatch = useDispatch()
  const isAutoSwitchMode = useSelector(isAutoSwitchModeSelector)
  const changeAutoSwitchMode = (checked: boolean) => {
    if (checked) {
      dispatch(setIsLiveMode(true))
    }
    dispatch(setIsAutoSwitchMode(checked))
  }

  return (
    <Checkbox
      size="small"
      checked={isAutoSwitchMode}
      onChange={(_, checked) => changeAutoSwitchMode(checked)}
    />
  )
}
