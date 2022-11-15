import { baseApi as api } from '../store/baseApi'
export const addTagTypes = [
  'Profile',
  'Event',
  'Track',
  'Talk',
  'VideoRegistration',
  'ChatMessage',
  'Sponsor',
  'Booth',
  'Point',
  'Vote',
  'DkUiData',
  'ViewerCount',
] as const
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getApiV1ByEventAbbrMyProfile: build.query<
        GetApiV1ByEventAbbrMyProfileApiResponse,
        GetApiV1ByEventAbbrMyProfileApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/${queryArg.eventAbbr}/my_profile`,
        }),
        providesTags: ['Profile'],
      }),
      getApiV1Events: build.query<
        GetApiV1EventsApiResponse,
        GetApiV1EventsApiArg
      >({
        query: () => ({ url: `/api/v1/events` }),
        providesTags: ['Event'],
      }),
      getApiV1EventsByEventAbbr: build.query<
        GetApiV1EventsByEventAbbrApiResponse,
        GetApiV1EventsByEventAbbrApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/events/${queryArg.eventAbbr}` }),
        providesTags: ['Event'],
      }),
      getApiV1Tracks: build.query<
        GetApiV1TracksApiResponse,
        GetApiV1TracksApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/tracks`,
          params: { eventAbbr: queryArg.eventAbbr },
        }),
        providesTags: ['Track'],
      }),
      getApiV1TracksByTrackId: build.query<
        GetApiV1TracksByTrackIdApiResponse,
        GetApiV1TracksByTrackIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/tracks/${queryArg.trackId}` }),
        providesTags: ['Track'],
      }),
      getApiV1Talks: build.query<GetApiV1TalksApiResponse, GetApiV1TalksApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/v1/talks`,
            params: {
              eventAbbr: queryArg.eventAbbr,
              trackId: queryArg.trackId,
              conferenceDayIds: queryArg.conferenceDayIds,
            },
          }),
          providesTags: ['Talk'],
        },
      ),
      getApiV1TalksByTalkId: build.query<
        GetApiV1TalksByTalkIdApiResponse,
        GetApiV1TalksByTalkIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/talks/${queryArg.talkId}` }),
        providesTags: ['Talk'],
      }),
      putApiV1TalksByTalkId: build.mutation<
        PutApiV1TalksByTalkIdApiResponse,
        PutApiV1TalksByTalkIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/talks/${queryArg.talkId}`,
          method: 'PUT',
          body: queryArg.body,
        }),
        invalidatesTags: ['Talk'],
      }),
      getApiV1TalksByTalkIdVideoRegistration: build.query<
        GetApiV1TalksByTalkIdVideoRegistrationApiResponse,
        GetApiV1TalksByTalkIdVideoRegistrationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/talks/${queryArg.talkId}/video_registration`,
        }),
        providesTags: ['VideoRegistration'],
      }),
      putApiV1TalksByTalkIdVideoRegistration: build.mutation<
        PutApiV1TalksByTalkIdVideoRegistrationApiResponse,
        PutApiV1TalksByTalkIdVideoRegistrationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/talks/${queryArg.talkId}/video_registration`,
          method: 'PUT',
          body: queryArg.videoRegistration,
        }),
        invalidatesTags: ['VideoRegistration'],
      }),
      getApiV1ChatMessages: build.query<
        GetApiV1ChatMessagesApiResponse,
        GetApiV1ChatMessagesApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/chat_messages`,
          params: {
            eventAbbr: queryArg.eventAbbr,
            roomId: queryArg.roomId,
            roomType: queryArg.roomType,
            createdFrom: queryArg.createdFrom,
          },
        }),
        providesTags: ['ChatMessage'],
      }),
      postApiV1ChatMessages: build.mutation<
        PostApiV1ChatMessagesApiResponse,
        PostApiV1ChatMessagesApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/chat_messages`,
          method: 'POST',
          body: queryArg.chatMessage,
        }),
        invalidatesTags: ['ChatMessage'],
      }),
      putApiV1ChatMessagesByMessageId: build.mutation<
        PutApiV1ChatMessagesByMessageIdApiResponse,
        PutApiV1ChatMessagesByMessageIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/chat_messages/${queryArg.messageId}`,
          method: 'PUT',
          body: queryArg.updateChatMessage,
        }),
        invalidatesTags: ['ChatMessage'],
      }),
      getApiV1Sponsors: build.query<
        GetApiV1SponsorsApiResponse,
        GetApiV1SponsorsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/sponsors`,
          params: { eventAbbr: queryArg.eventAbbr },
        }),
        providesTags: ['Sponsor'],
      }),
      getApiV1BoothsByBoothId: build.query<
        GetApiV1BoothsByBoothIdApiResponse,
        GetApiV1BoothsByBoothIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/v1/booths/${queryArg.boothId}` }),
        providesTags: ['Booth'],
      }),
      getApiV1ProfileByProfileIdPoints: build.query<
        GetApiV1ProfileByProfileIdPointsApiResponse,
        GetApiV1ProfileByProfileIdPointsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/profile/${queryArg.profileId}/points`,
          params: { conference: queryArg.conference },
        }),
        providesTags: ['Point'],
      }),
      optionsApiV1ProfileByProfileIdPoints: build.mutation<
        OptionsApiV1ProfileByProfileIdPointsApiResponse,
        OptionsApiV1ProfileByProfileIdPointsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/profile/${queryArg.profileId}/points`,
          method: 'OPTIONS',
        }),
      }),
      postApiV1TalksByTalkIdVote: build.mutation<
        PostApiV1TalksByTalkIdVoteApiResponse,
        PostApiV1TalksByTalkIdVoteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/talks/${queryArg.talkId}/vote`,
          method: 'POST',
          body: queryArg.vote,
        }),
        invalidatesTags: ['Vote'],
      }),
      optionsApiV1TalksByTalkIdVote: build.mutation<
        OptionsApiV1TalksByTalkIdVoteApiResponse,
        OptionsApiV1TalksByTalkIdVoteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/talks/${queryArg.talkId}/vote`,
          method: 'OPTIONS',
        }),
      }),
      postApiV1ProfileByProfileIdPoint: build.mutation<
        PostApiV1ProfileByProfileIdPointApiResponse,
        PostApiV1ProfileByProfileIdPointApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/profile/${queryArg.profileId}/point`,
          method: 'POST',
          body: queryArg.profilePoint,
        }),
        invalidatesTags: ['Point'],
      }),
      optionsApiV1ProfileByProfileIdPoint: build.mutation<
        OptionsApiV1ProfileByProfileIdPointApiResponse,
        OptionsApiV1ProfileByProfileIdPointApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/profile/${queryArg.profileId}/point`,
          method: 'OPTIONS',
        }),
      }),
      getApiV1AppDataByProfileIdConferenceAndConference: build.query<
        GetApiV1AppDataByProfileIdConferenceAndConferenceApiResponse,
        GetApiV1AppDataByProfileIdConferenceAndConferenceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/app-data/${queryArg.profileId}/conference/${queryArg.conference}`,
        }),
        providesTags: ['DkUiData'],
      }),
      postApiV1AppDataByProfileIdConferenceAndConference: build.mutation<
        PostApiV1AppDataByProfileIdConferenceAndConferenceApiResponse,
        PostApiV1AppDataByProfileIdConferenceAndConferenceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/app-data/${queryArg.profileId}/conference/${queryArg.conference}`,
          method: 'POST',
          body: queryArg.dkUiDataMutation,
        }),
        invalidatesTags: ['DkUiData'],
      }),
      optionsApiV1AppDataByProfileIdConferenceAndConference: build.mutation<
        OptionsApiV1AppDataByProfileIdConferenceAndConferenceApiResponse,
        OptionsApiV1AppDataByProfileIdConferenceAndConferenceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/app-data/${queryArg.profileId}/conference/${queryArg.conference}`,
          method: 'OPTIONS',
        }),
      }),
      getApiV1TracksByTrackIdViewerCount: build.query<
        GetApiV1TracksByTrackIdViewerCountApiResponse,
        GetApiV1TracksByTrackIdViewerCountApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/tracks/${queryArg.trackId}/viewer_count`,
        }),
        providesTags: ['ViewerCount'],
      }),
      optionsApiV1TracksByTrackIdViewerCount: build.mutation<
        OptionsApiV1TracksByTrackIdViewerCountApiResponse,
        OptionsApiV1TracksByTrackIdViewerCountApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/tracks/${queryArg.trackId}/viewer_count`,
          method: 'OPTIONS',
        }),
      }),
    }),
    overrideExisting: false,
  })
export { injectedRtkApi as dreamkastApi }
export type GetApiV1ByEventAbbrMyProfileApiResponse =
  /** status 200 OK */ Profile
export type GetApiV1ByEventAbbrMyProfileApiArg = {
  /** ID of event */
  eventAbbr: string
}
export type GetApiV1EventsApiResponse = /** status 200 OK */ Event[]
export type GetApiV1EventsApiArg = void
export type GetApiV1EventsByEventAbbrApiResponse = /** status 200 OK */ Event
export type GetApiV1EventsByEventAbbrApiArg = {
  /** ID of event */
  eventAbbr: string
}
export type GetApiV1TracksApiResponse = /** status 200 OK */ Track[]
export type GetApiV1TracksApiArg = {
  /** abbr of event (e.g. cndt2020) */
  eventAbbr: string
}
export type GetApiV1TracksByTrackIdApiResponse = /** status 200 OK */ Track
export type GetApiV1TracksByTrackIdApiArg = {
  /** ID of track */
  trackId: string
}
export type GetApiV1TalksApiResponse = /** status 200 OK */ Talk[]
export type GetApiV1TalksApiArg = {
  /** abbr of event (e.g. cndt2020) */
  eventAbbr: string
  /** ID of track */
  trackId?: string
  conferenceDayIds?: string
}
export type GetApiV1TalksByTalkIdApiResponse = /** status 200 OK */ Talk
export type GetApiV1TalksByTalkIdApiArg = {
  /** ID of talk */
  talkId: string
}
export type PutApiV1TalksByTalkIdApiResponse = unknown
export type PutApiV1TalksByTalkIdApiArg = {
  /** ID of talk */
  talkId: string
  /** Update on_air status */
  body: {
    on_air?: boolean | undefined
  }
}
export type GetApiV1TalksByTalkIdVideoRegistrationApiResponse =
  /** status 200 OK */ VideoRegistration
export type GetApiV1TalksByTalkIdVideoRegistrationApiArg = {
  /** ID of talk */
  talkId: string
}
export type PutApiV1TalksByTalkIdVideoRegistrationApiResponse = unknown
export type PutApiV1TalksByTalkIdVideoRegistrationApiArg = {
  /** ID of talk */
  talkId: string
  /** Update video_registration */
  videoRegistration: VideoRegistration
}
export type GetApiV1ChatMessagesApiResponse = /** status 200 OK */ ChatMessage[]
export type GetApiV1ChatMessagesApiArg = {
  /** abbr of event (e.g. cndt2020) */
  eventAbbr: string
  /** ID of chat room */
  roomId: string
  /** Type of chat room */
  roomType: string
  /** YYYY-MM-DDThh:mm:ss+TZD (use UTC) */
  createdFrom?: string
}
export type PostApiV1ChatMessagesApiResponse = unknown
export type PostApiV1ChatMessagesApiArg = {
  /** chat message to create */
  chatMessage: ChatMessage
}
export type PutApiV1ChatMessagesByMessageIdApiResponse =
  /** status 200 OK */ ChatMessage[]
export type PutApiV1ChatMessagesByMessageIdApiArg = {
  /** ID of ChatMessage */
  messageId: string
  /** chat message to update */
  updateChatMessage: UpdateChatMessage
}
export type GetApiV1SponsorsApiResponse = /** status 200 OK */ Sponsor[]
export type GetApiV1SponsorsApiArg = {
  /** abbr of event (e.g. cndt2020) */
  eventAbbr: string
}
export type GetApiV1BoothsByBoothIdApiResponse = /** status 200 OK */ Booth
export type GetApiV1BoothsByBoothIdApiArg = {
  /** ID of booth */
  boothId: string
}
export type GetApiV1ProfileByProfileIdPointsApiResponse =
  /** status 200 200 response */ ProfilePointsResponse
export type GetApiV1ProfileByProfileIdPointsApiArg = {
  conference: string
  profileId: string
}
export type OptionsApiV1ProfileByProfileIdPointsApiResponse = unknown
export type OptionsApiV1ProfileByProfileIdPointsApiArg = {
  profileId: string
}
export type PostApiV1TalksByTalkIdVoteApiResponse =
  /** status 200 200 response */ CommonResponse
export type PostApiV1TalksByTalkIdVoteApiArg = {
  talkId: string
  vote: VoteResponse
}
export type OptionsApiV1TalksByTalkIdVoteApiResponse = unknown
export type OptionsApiV1TalksByTalkIdVoteApiArg = {
  talkId: string
}
export type PostApiV1ProfileByProfileIdPointApiResponse =
  /** status 200 200 response */ CommonResponse
export type PostApiV1ProfileByProfileIdPointApiArg = {
  profileId: string
  profilePoint: ProfilePointRequest
}
export type OptionsApiV1ProfileByProfileIdPointApiResponse = unknown
export type OptionsApiV1ProfileByProfileIdPointApiArg = {
  profileId: string
}
export type GetApiV1AppDataByProfileIdConferenceAndConferenceApiResponse =
  /** status 200 200 response */ DkUiData
export type GetApiV1AppDataByProfileIdConferenceAndConferenceApiArg = {
  profileId: string
  conference: string
}
export type PostApiV1AppDataByProfileIdConferenceAndConferenceApiResponse =
  /** status 200 200 response */ CommonResponse
export type PostApiV1AppDataByProfileIdConferenceAndConferenceApiArg = {
  profileId: string
  conference: string
  dkUiDataMutation: DkUiDataMutation
}
export type OptionsApiV1AppDataByProfileIdConferenceAndConferenceApiResponse =
  unknown
export type OptionsApiV1AppDataByProfileIdConferenceAndConferenceApiArg = {
  profileId: string
  conference: string
}
export type GetApiV1TracksByTrackIdViewerCountApiResponse =
  /** status 200 200 response */ ViewerCountResponse
export type GetApiV1TracksByTrackIdViewerCountApiArg = {
  trackId: string
}
export type OptionsApiV1TracksByTrackIdViewerCountApiResponse = unknown
export type OptionsApiV1TracksByTrackIdViewerCountApiArg = {
  trackId: string
}
export type RegisteredTalk = {
  talkId?: number | undefined
  talkTitle?: string | undefined
  talkSpeakers?:
    | {
        name?: string | undefined
        twitterId?: string | undefined
      }[]
    | undefined
  talkStartTime?: string | undefined
  talkEndTime?: string | undefined
  trackName?: string | undefined
  roomName?: string | undefined
  conferenceDay?: string | undefined
}
export type Profile = {
  id: number
  name: string
  email: string
  isAttendOffline: boolean
  registeredTalks?: RegisteredTalk[] | undefined
}
export type Event = {
  id: number
  name: string
  abbr: string
  status: string
  theme: string
  about: string
  privacy_policy: string
  privacy_policy_for_speaker: string
  copyright: string
  coc: string
  conferenceDays?:
    | {
        id?: number | undefined
        date?: string | undefined
        internal?: boolean | undefined
      }[]
    | undefined
}
export type Track = {
  id: number
  name: string
  videoPlatform?: (string | null) | undefined
  videoId?: (string | null) | undefined
  channelArn?: (string | null) | undefined
  onAirTalk?: (object | null) | undefined
}
export type Talk = {
  id: number
  conferenceId?: number | undefined
  trackId: number
  videoPlatform?: string | undefined
  videoId: string
  title: string
  abstract: string
  speakers: {
    id?: number | undefined
    name?: string | undefined
  }[]
  dayId: number | null
  showOnTimetable: boolean
  startTime: string
  endTime: string
  talkDuration: number
  talkDifficulty: string
  talkCategory: string
  onAir?: boolean | undefined
  documentUrl?: string | undefined
  conferenceDayId?: (number | null) | undefined
  conferenceDayDate?: (string | null) | undefined
  startOffset?: number | undefined
  endOffset?: number | undefined
  actualStartTime?: string | undefined
  actualEndTime?: string | undefined
  presentationMethod?: (string | null) | undefined
  slotNum?: number | undefined
}
export type VideoRegistration = {
  url?: string | undefined
  status: 'unsubmitted' | 'submitted' | 'confirmed' | 'invalid_format'
  statistics?: object | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
export type ChatMessageProperties = {
  id?: number | undefined
  profileId?: number | undefined
  speakerId?: (number | null) | undefined
  eventAbbr?: string | undefined
  roomId?: number | undefined
  roomType?: string | undefined
  body?: string | undefined
  createdAt?: string | undefined
  messageType?: ('chat' | 'qa') | undefined
  replyTo?: (number | null) | undefined
}
export type ChatMessage = ChatMessageProperties
export type UpdateChatMessage = ChatMessageProperties
export type Sponsor = {
  id: number
  eventAbbr: string
  name: string
  abbr: string
  url: string
  logo_url: string
  sponsorType?: string[] | undefined
  booth?:
    | {
        id?: number | undefined
        opened?: boolean | undefined
      }
    | undefined
}
export type Booth = {
  id: number
  sponsorId: number
  sponsorName: string
  published: boolean
  description: string
  url?: string | undefined
  abbr: string
  text: string
  logoUrl: string
  vimeoUrl: string
  miroUrl: string
  pdfUrls: {
    url?: string | undefined
    title?: string | undefined
  }[]
  keyImageUrls: string[]
}
export type ProfilePointsResponse = {
  total: number
  points: {
    conference: string
    pointEventId: string
    point?: number | undefined
    timestamp?: number | undefined
  }[]
}
export type ErrorSchema = {
  message?: string | undefined
}
export type CommonResponse = {
  message?: string | undefined
  status?: string | undefined
  [key: string]: any
}
export type VoteResponse = {
  eventAbbr: string
}
export type ProfilePointRequest = {
  conference: string
  pointEventId: string
}
export type DkUiData = {
  watchedTalksOnline: {
    watchingTime?:
      | {
          [key: string]: any
        }
      | undefined
    prevTimestamp?: number | undefined
  }
  stampChallenges: {
    condition?: string | undefined
    waiting: boolean
    slotId: number
    timestamp?: number | undefined
  }[]
  [key: string]: any
}
export type DkUiDataMutation = {
  payload: {
    [key: string]: any
  }
  action: string
}
export type ViewerCountResponse = {
  trackId: number
  viewerCount: number
}
export const {
  useGetApiV1ByEventAbbrMyProfileQuery,
  useGetApiV1EventsQuery,
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1TracksQuery,
  useGetApiV1TracksByTrackIdQuery,
  useGetApiV1TalksQuery,
  useGetApiV1TalksByTalkIdQuery,
  usePutApiV1TalksByTalkIdMutation,
  useGetApiV1TalksByTalkIdVideoRegistrationQuery,
  usePutApiV1TalksByTalkIdVideoRegistrationMutation,
  useGetApiV1ChatMessagesQuery,
  usePostApiV1ChatMessagesMutation,
  usePutApiV1ChatMessagesByMessageIdMutation,
  useGetApiV1SponsorsQuery,
  useGetApiV1BoothsByBoothIdQuery,
  useGetApiV1ProfileByProfileIdPointsQuery,
  useOptionsApiV1ProfileByProfileIdPointsMutation,
  usePostApiV1TalksByTalkIdVoteMutation,
  useOptionsApiV1TalksByTalkIdVoteMutation,
  usePostApiV1ProfileByProfileIdPointMutation,
  useOptionsApiV1ProfileByProfileIdPointMutation,
  useGetApiV1AppDataByProfileIdConferenceAndConferenceQuery,
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
  useOptionsApiV1AppDataByProfileIdConferenceAndConferenceMutation,
  useGetApiV1TracksByTrackIdViewerCountQuery,
  useOptionsApiV1TracksByTrackIdViewerCountMutation,
} = injectedRtkApi
