import React from 'react'
import * as Styled from './styled'
import { showLT } from '../../store/settings'
import { useDispatch } from 'react-redux'

export const ShowLTButton: React.FC = () => {
  const dispatch = useDispatch()

  return (
    <Styled.ShowLTButton
      data-testid="btn"
      color="primary"
      onClick={() => {
        dispatch(showLT())
      }}
    >
      Community LT
    </Styled.ShowLTButton>
  )
}
