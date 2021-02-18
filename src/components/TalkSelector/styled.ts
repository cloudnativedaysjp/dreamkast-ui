import styled from 'styled-components'
import { List as OriginList } from '@material-ui/core'

export const Container = styled.div`
  padding: 10px;
  height: 500px;
`

export const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  border: 1.5px solid;
  border-bottom: none;
  border-radius: 5px 5px 0px 0px;
`

export const List = styled(OriginList)`
  height: 450px;
  border: 1.5px solid;
  overflow-y: scroll;
  border-radius: 0px 0px 5px 5px;
`
