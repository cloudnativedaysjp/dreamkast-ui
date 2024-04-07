import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'

type Props = {
  storedKeys: string[]
  deleteItem: (key: string) => void
}

export const Debug: React.FC<Props> = ({ storedKeys, deleteItem }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>type</TableCell>
            <TableCell>profileId</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {storedKeys.map((key) => {
            const value = localStorage.getItem(key)
            if (value) {
              const { checkInType, profileId } = JSON.parse(value)
              return (
                <TableRow key={key}>
                  <TableCell>{checkInType}</TableCell>
                  <TableCell>{profileId}</TableCell>
                  <TableCell>
                    <Button
                      type="submit"
                      onClick={() => deleteItem(key)}
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
