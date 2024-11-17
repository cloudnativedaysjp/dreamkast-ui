import { NextPage } from 'next'
import React, { useEffect, useMemo, useState } from 'react'
import { Layout } from '../../../../../components/Layout'
import {
  PrintNodePrinter,
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1PrintNodePrintersQuery,
} from '../../../../../generated/dreamkast-api.generated'
import { useRouter } from 'next/router'
import Error404 from '../../../../404'
import { CheckIn } from '../../../../../components/CheckIn/CheckIn'
import { MenuItem, Select, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { authSelector } from '../../../../../store/auth'
import { ENV } from '../../../../../config'

const IndexPage: NextPage = () => {
  return <IndexMain />
}

const IndexMain = () => {
  const router = useRouter()
  const eventAbbr = useMemo<string>(() => {
    if (router.asPath !== router.route) {
      const { eventAbbr } = router.query
      return eventAbbr as string
    }
    return ''
  }, [router])
  const { roles } = useSelector(authSelector)
  const isAdminRole = roles.includes(`${eventAbbr.toUpperCase()}-Admin`)
  const skip = eventAbbr === null
  const { data: event } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr },
    { skip },
  )
  const [printers, setPrinters] = useState<PrintNodePrinter[]>([])
  const { data, isLoading, isError, error } = useGetApiV1PrintNodePrintersQuery(
    { eventAbbr },
  )
  useEffect(() => {
    if (isLoading) {
      return
    }
    if (isError) {
      throw error
    }
    if (data) {
      console.log(data)
      setPrinters(data)
    }
  }, [data, isLoading, isError])

  const [selectedPrinter, setSelectedPrinter] =
    useState<PrintNodePrinter | null>(null)
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPrinter(
      printers.find((printer) => printer.id === event.target.value) || null,
    )
  }
  if (event) {
    if (isAdminRole) {
      return (
        <Layout title={event.name} event={event}>
          <Typography variant="h5">
            イベント受付 ({event.abbr.toUpperCase()})
            <Select
              value={selectedPrinter ? selectedPrinter.id : 'default'}
              onChange={handleSelectChange}
            >
              <MenuItem value="default">プリンターを選択</MenuItem>
              {printers.map((printer) => {
                return <MenuItem value={printer.id}>{printer.name}</MenuItem>
              })}
            </Select>
            )
          </Typography>
          <CheckIn checkInType={'event'} eventAbbr={event.abbr} printerId={selectedPrinter?.id} />
        </Layout>
      )
    } else {
      return (
        <Layout title={event.name} event={event}>
          {Error404()}
        </Layout>
      )
    }
  } else {
    return <div></div>
  }
}

// TODO move to RootApp component
export const getServerSideProps = async () => {
  return {
    props: {
      env: { ...ENV },
    },
  }
}

export default IndexPage
