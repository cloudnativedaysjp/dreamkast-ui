import styled from 'styled-components'
import { Box as MaterialUIBox } from '@material-ui/core'

export const Box = styled(MaterialUIBox)`
  height: 400px;
  padding: 10px 0;
  overflow-x: hidden;
  background-color: rgba(255, 255, 255, 0.7);
  &::-webkit-scrollbar {
    width: 12px;
    background-color: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(3, 127, 140, 0.8);
  }
`
