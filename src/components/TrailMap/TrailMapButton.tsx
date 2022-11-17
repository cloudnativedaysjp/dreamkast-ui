import React from 'react'
import { Badge } from '@material-ui/core'
import * as Styled from './styled'
import { setTrailMapOpen, stampSelector } from '../../store/settings'
import { useDispatch, useSelector } from 'react-redux'

export const TrailMapButton = () => {
  const stamp = useSelector(stampSelector)
  const dispatch = useDispatch()
  return (
    <Badge
      badgeContent={'!'}
      color="secondary"
      invisible={!stamp.canGetNewStamp}
    >
      <Styled.TrailMapButton
        onClick={() => dispatch(setTrailMapOpen(true))}
        className={stamp.canGetNewStamp ? 'pulse' : ''}
      >
        Trail Map
      </Styled.TrailMapButton>
    </Badge>
  )
}
