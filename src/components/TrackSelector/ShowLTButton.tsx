import React from 'react'
import * as Styled from './styled'
import { PeopleAlt } from '@material-ui/icons'
import { showLT } from '../../store/settings'
import { useDispatch } from 'react-redux'
import HtmlTooltip from './HtmlTooltip'

export const ShowLTButton: React.FC = () => {
  const dispatch = useDispatch()

  return (
    <HtmlTooltip title="コミュニティLT">
      <Styled.ShowLTButton
        data-testid="btn"
        color="primary"
        onClick={() => {
          dispatch(showLT())
        }}
      >
        <PeopleAlt />
      </Styled.ShowLTButton>
    </HtmlTooltip>
  )
}
