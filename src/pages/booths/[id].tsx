import { Layout } from '../../components/Layout'
import { BoothPage } from '../../components/BoothPage'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const IndexPage: React.FC = () => {
  const router = useRouter()
  const [id, setId] = useState<string>()

  useEffect(() => {
    if (router.asPath !== router.route) {
      const { id } = router.query
      setId(id as string)
    }
  }, [router])

  return (
    <Layout title="CloudNative Days 2021">
      <BoothPage boothId={id} />
    </Layout>
  )
}

export default IndexPage
