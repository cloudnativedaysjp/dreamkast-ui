import React from 'react'
import * as Styled from '../styled'
import { pointsSelector } from '../../../store/points'
import { useSelector } from 'react-redux'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'

export const TrailMapPointHistory = () => {
  const { pointData } = useSelector(pointsSelector)
  return (
    <Styled.PointHistoryTable>
      <TableContainer component={Paper}>
        <Table aria-label="event-history" size="small">
          <TableHead>
            <TableRow>
              <TableCell>獲得ポイント</TableCell>
              <TableCell>達成条件</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pointData.points.map((p) => {
              return (
                <TableRow key={p.pointEventId}>
                  <TableCell component="th" scope="row">
                    {p.point}pt
                  </TableCell>
                  <TableCell>{p.desc}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Styled.PointHistoryTable>
  )
}
