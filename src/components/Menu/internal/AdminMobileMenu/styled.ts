import { ListItem } from '@material-ui/core'
import styled from 'styled-components'

export const NestedListItem = styled(ListItem)`
  padding-left: ${(props) => `${props.theme.spacing(4)}px`};
`
