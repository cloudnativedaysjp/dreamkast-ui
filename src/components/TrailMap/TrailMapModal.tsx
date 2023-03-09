import React, { PropsWithChildren, ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { appDataSelector, setTrailMapOpen } from '../../store/appData'
import * as Styled from './styled'

export const TrailMapModal = ({ children }: PropsWithChildren) => {
  const appData = useSelector(appDataSelector)
  const dispatch = useDispatch()

  return (
    <Styled.TrailMapModal
      open={appData.isTrailMapOpen}
      onClose={() => dispatch(setTrailMapOpen(false))}
    >
      {children as ReactElement}
    </Styled.TrailMapModal>
  )
}
