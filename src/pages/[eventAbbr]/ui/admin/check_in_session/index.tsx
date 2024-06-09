import { NextPage } from 'next'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Layout } from '../../../../../components/Layout'
import {
  Talk,
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1TalksQuery,
} from '../../../../../generated/dreamkast-api.generated'
import { useRouter } from 'next/router'
import { withAuthProvider } from '../../../../../context/auth'
import Error404 from '../../../../404'
import { CheckIn } from '../../../../../components/CheckIn/CheckIn'
import { MenuItem, Select, Typography } from '@material-ui/core'
import { authSelector } from '../../../../../store/auth'
import { useSelector } from 'react-redux'
import { PrivateCtx } from '../../../../../context/private'

const IndexPage: NextPage = () => {
  const { env } = useContext(PrivateCtx)
  return withAuthProvider(
    <IndexMain />,
    `/${env.NEXT_PUBLIC_BASE_PATH}/admin/check_in_session`,
  )
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
                return <MenuItem value={talk.id}>{talk.title}</MenuItem>
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

export default IndexPage
