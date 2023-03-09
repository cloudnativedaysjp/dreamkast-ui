import React from 'react'
import * as Styled from '../styled'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { ProfilePointsResponse } from '../../../generated/dreamkast-api.generated'
import { createStyles, withStyles } from '@material-ui/styles'

type Props = {
  pointData: ProfilePointsResponse
}

const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      backgroundColor: '#efebe9',
    },
    body: {
      backgroundColor: '#efebe9',
    },
  }),
)(TableCell)

export const TrailMapPointHistory = ({ pointData }: Props) => {
  return (
    <Styled.PointHistoryTable>
      <TableContainer>
        <Table aria-label="event-history" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>獲得ポイント</StyledTableCell>
              <StyledTableCell>達成条件</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pointData.points.map((p) => {
              return (
                <TableRow key={p.pointEventId}>
                  <StyledTableCell component="th" scope="row">
                    {p.point}pt
                  </StyledTableCell>
                  <StyledTableCell>{p.desc}</StyledTableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Styled.PointHistoryTable>
  )
}
