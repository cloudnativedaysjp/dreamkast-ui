import React from 'react'
import { isLiveModeSelector, setIsLiveMode } from '../../store/settings'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@material-ui/core'

export const LiveModeCheckbox = () => {
  const dispatch = useDispatch()
  const isLiveMode = useSelector(isLiveModeSelector)
  const changeLiveMode = (checked: boolean) => {
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
