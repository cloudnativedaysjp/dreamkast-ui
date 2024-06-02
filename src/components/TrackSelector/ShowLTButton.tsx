import React from 'react'
import * as Styled from './styled'
import { PeopleAlt } from '@material-ui/icons'
import { showLT } from '../../store/settings'
import { useDispatch } from 'react-redux'

export const ShowLTButton: React.FC = () => {
  const dispatch = useDispatch()

  return (
    <>
      <Styled.ShowLTButton
        data-testid="btn"
        color="primary"
        onClick={() => {
          dispatch(showLT())
        }}
      >
        <PeopleAlt />
      </Styled.ShowLTButton>
    </>
  )
}
