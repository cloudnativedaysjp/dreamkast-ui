import React from 'react'
import {
  notifyRegisteredTalkStartedSelector,
  setNotifyRegisteredTalkStarted,
} from '../../store/settings'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox } from '@material-ui/core'

export const NotifyRegisteredTalkStartedCheckbox = () => {
  const dispatch = useDispatch()
  const isAutoSwitchMode = useSelector(notifyRegisteredTalkStartedSelector)
  const changeAutoSwitchMode = (checked: boolean) => {
    dispatch(setNotifyRegisteredTalkStarted(checked))
  }

  return (
    <Checkbox
      size="small"
      checked={isAutoSwitchMode}
      onChange={(_, checked) => changeAutoSwitchMode(checked)}
    />
  )
}
