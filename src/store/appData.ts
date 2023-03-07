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

const appDataSlice = createSlice({
  name: 'appData',
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

export const { setAppData, setPointData, setTrailMapOpen } =
  appDataSlice.actions

export const appDataSelector = (s: RootState) => s.appData

const appDataInnerSelector = createSelector(appDataSelector, (s) => s.appData)
const stampChallengesSelector = createSelector(
  appDataInnerSelector,
  (s) => s.stampChallenges,
)

export const useStamps = () => {
  const stampChallenges = useSelector(stampChallengesSelector)
  return {
    canGetNewStamp: !!stampChallenges.find((i) => i.waiting),
    slotIdToBeStamped: stampChallenges.find((i) => i.waiting)?.slotId,
    stamps: stampChallenges.filter((i) => i.condition === 'stamped'),
  }
}

export default appDataSlice
