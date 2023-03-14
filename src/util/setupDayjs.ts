import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

export const setupDayjs = () => {
  dayjs.extend(timezone)
  dayjs.extend(utc)
  dayjs.tz.setDefault('Asia/Tokyo')
}
