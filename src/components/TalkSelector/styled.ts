import styled from 'styled-components'
import { List as OriginList, ListItem, ListItemText } from '@material-ui/core'

export const Container = styled.div`
  padding: 8px;
  height: 500px;
`

export const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  border: 1.5px solid black;
  border-bottom: none;
  border-radius: 10px 10px 0px 0px;
  background-color: #ffffff;
  color: #037f8c;
`

export const List = styled(OriginList)`
  height: 450px;
  border: 1.5px solid;
  overflow-y: scroll;
  border-radius: 0px 0px 10px 10px;
  background-color: #ffffff;
  &::-webkit-scrollbar {
    display: none;
  }
`

export const Item = styled(ListItem)``

export const Text = styled(ListItemText)``
