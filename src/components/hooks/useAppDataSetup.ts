import { useEffect } from 'react'
import {
  useGetApiV1AppDataByProfileIdConferenceAndConferenceQuery,
  useGetApiV1ProfileByProfileIdPointsQuery,
} from '../../generated/dreamkast-api.generated'
import { setAppData, setPointData } from '../../store/appData'
import { useDispatch, useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

export const useAppDataSetup = () => {
  const dispatch = useDispatch()
  const settings = useSelector(settingsSelector)
  const { eventAbbr, profile } = settings

  const skip = !eventAbbr || !profile.id
  const appDataQuery =
    useGetApiV1AppDataByProfileIdConferenceAndConferenceQuery(
      { profileId: `${profile.id}`, conference: eventAbbr },
      { skip },
    )
  useEffect(() => {
    if (appDataQuery.data) {
      dispatch(setAppData(appDataQuery.data))
    }
  }, [appDataQuery.data])

  const pointQuery = useGetApiV1ProfileByProfileIdPointsQuery(
    { profileId: `${profile.id}`, conference: eventAbbr },
    { skip },
  )
  useEffect(() => {
    if (pointQuery.data) {
      dispatch(setPointData(pointQuery.data))
    }
  }, [pointQuery.data])

  return {
    appData: appDataQuery.data,
    pointData: pointQuery.data,
    isLoading: !appDataQuery.data || !pointQuery.data,
  }
}
