import React from 'react'
import { Badge } from '@material-ui/core'
import * as Styled from './styled'
import { setTrailMapOpen, useStamps } from '../../store/settings'
import { useDispatch } from 'react-redux'

export const TrailMapButton = () => {
  const stamp = useStamps()
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
