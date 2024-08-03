import { NextPage } from 'next'
import React, { useEffect, useMemo, useState } from 'react'
import { Layout } from '../../../../../components/Layout'
import {
  Talk,
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1TalksQuery,
} from '../../../../../generated/dreamkast-api.generated'
import { useRouter } from 'next/router'
import Error404 from '../../../../404'
import { CheckIn } from '../../../../../components/CheckIn/CheckIn'
import { MenuItem, Select, Typography } from '@material-ui/core'
import { authSelector } from '../../../../../store/auth'
import { useSelector } from 'react-redux'
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
  const { data, isLoading, isError, error } = useGetApiV1TalksQuery(
    { eventAbbr },
    { skip: !eventAbbr },
  )

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (isError) {
      throw error
    }
    if (data) {
      setTalks(data.filter((talk) => talk.type === 'SponsorSession'))
    }
  }, [data, isLoading, isError])

  const [talks, setTalks] = useState<Talk[]>([])
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null)
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTalk(
      talks.find((talk) => talk.id === event.target.value) || null,
    )
  }

  if (event) {
    if (isAdminRole) {
      return (
        <Layout title={event.name} event={event}>
          <Typography variant="h5">
            セッション受付 (
            <Select
              value={selectedTalk ? selectedTalk.id : 'default'}
              onChange={handleSelectChange}
            >
              <MenuItem value="default">セッションを選択</MenuItem>
              {talks.map((talk) => {
                return <MenuItem value={talk.id}>{talk.sponsor?.name}</MenuItem>
              })}
            </Select>
            )
          </Typography>
          {selectedTalk != null && (
            <CheckIn
              checkInType={'session'}
              eventAbbr={event.abbr}
              talk={selectedTalk}
            />
          )}
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
