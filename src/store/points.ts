import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  DkUiData,
  ProfilePointsResponse,
} from '../generated/dreamkast-api.generated'
import { RootState } from './index'
import { createSelector } from 'reselect'
import { useSelector } from 'react-redux'

type AppDataState = {
  appData: DkUiData
  appDataInitialized: boolean
  pointData: ProfilePointsResponse
  pointDataInitialized: boolean
  isTrailMapOpen: boolean
}

const initialState: AppDataState = {
  appData: {
    watchedTalksOnline: {
      watchingTime: [],
      prevTimestamp: 0,
    },
    stampChallenges: [],
  },
  appDataInitialized: false,
  pointData: {
    total: 0,
    points: [],
  },
  pointDataInitialized: false,
  isTrailMapOpen: false,
}

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    setAppData: (state, action: PayloadAction<DkUiData>) => {
      state.appData = action.payload
      state.appDataInitialized = true
    },
    setPointData: (state, action: PayloadAction<ProfilePointsResponse>) => {
      state.pointData = action.payload
      state.pointDataInitialized = true
    },
    setTrailMapOpen: (state, action: PayloadAction<boolean>) => {
      state.isTrailMapOpen = action.payload
    },
  },
})

export const { setAppData, setPointData, setTrailMapOpen } = pointsSlice.actions

export const pointsSelector = (s: RootState) => s.points

const appDataSelector = createSelector(pointsSelector, (s) => s.appData)

export const useStamps = () => {
  const appData = useSelector(appDataSelector)
  return {
    canGetNewStamp: !!appData.stampChallenges.find((i) => i.waiting),
    slotIdToBeStamped: appData.stampChallenges.find((i) => i.waiting)?.slotId,
    stamps: appData.stampChallenges.filter((i) => i.condition === 'stamped'),
  }
}

export default pointsSlice
