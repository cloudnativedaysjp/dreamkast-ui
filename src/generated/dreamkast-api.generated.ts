import { baseApi as api } from '../store/baseApi'
export const addTagTypes = [
  'Profile',
  'CheckIn',
  'Event',
  'Track',
  'Speaker',
  'Proposal',
  'Talk',
  'VideoRegistration',
  'ChatMessage',
  'Sponsor',
  'Booth',
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
      postApiV1CheckInEvents: build.mutation<
        PostApiV1CheckInEventsApiResponse,
        PostApiV1CheckInEventsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/check_in_events`,
          method: 'POST',
          body: queryArg.checkInEvent,
        }),
        invalidatesTags: ['CheckIn'],
      }),
      postApiV1CheckInTalks: build.mutation<
        PostApiV1CheckInTalksApiResponse,
        PostApiV1CheckInTalksApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/check_in_talks`,
          method: 'POST',
          body: queryArg.checkInTalk,
        }),
        invalidatesTags: ['CheckIn'],
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
      getApiV1Streamings: build.query<
        GetApiV1StreamingsApiResponse,
        GetApiV1StreamingsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/streamings`,
          params: { eventAbbr: queryArg.eventAbbr },
        }),
      }),
      getApiV1Speakers: build.query<
        GetApiV1SpeakersApiResponse,
        GetApiV1SpeakersApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/speakers`,
          params: { eventAbbr: queryArg.eventAbbr },
        }),
        providesTags: ['Speaker'],
      }),
      getApiV1Proposals: build.query<
        GetApiV1ProposalsApiResponse,
        GetApiV1ProposalsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/proposals`,
          params: { eventAbbr: queryArg.eventAbbr },
        }),
        providesTags: ['Proposal'],
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
export type PostApiV1CheckInEventsApiResponse = unknown
export type PostApiV1CheckInEventsApiArg = {
  checkInEvent: CheckInEvent
}
export type PostApiV1CheckInTalksApiResponse = unknown
export type PostApiV1CheckInTalksApiArg = {
  checkInTalk: CheckInTalk
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
export type GetApiV1StreamingsApiResponse = /** status 200 OK */ Streaming[]
export type GetApiV1StreamingsApiArg = {
  /** abbr of event (e.g. cndt2020) */
  eventAbbr: string
}
export type GetApiV1SpeakersApiResponse = /** status 200 OK */ Speaker[]
export type GetApiV1SpeakersApiArg = {
  /** abbr of event (e.g. cndt2020) */
  eventAbbr: string
}
export type GetApiV1ProposalsApiResponse = /** status 200 OK */ Proposal[]
export type GetApiV1ProposalsApiArg = {
  /** abbr of event (e.g. cndt2020) */
  eventAbbr: string
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
export type CheckInEvent = {
  profileId: string
  eventAbbr: string
  checkInTimestamp: number
}
export type CheckInTalk = {
  profileId: string
  eventAbbr: string
  talkId: string
  checkInTimestamp: number
}
export type Event = {
  id: number
  name: string
  abbr: string
  status: string
  rehearsalMode?: boolean | undefined
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
export type Streaming = {
  id?: string | undefined
  status?: string | undefined
  trackId?: number | undefined
  destinationUrl?: string | undefined
  playbackUrl?: string | undefined
  mediaLiveChannelStatus?: string | undefined
}
export type Speaker = {
  id: number
  name: string
  company?: (string | null) | undefined
  jobTitle?: string | undefined
  profile?: string | undefined
  githubId?: (string | null) | undefined
  twitterId?: (string | null) | undefined
  avatarUrl?: (string | null) | undefined
}
export type Proposal = {
  id: number
  status: string
  conferenceId: number
  talkId: number
  title?: string | undefined
  abstract?: string | undefined
  speakers?:
    | {
        name?: string | undefined
        id?: number | undefined
      }[]
    | undefined
  params?: object | undefined
}
export type Talk = {
  id: number
  type?:
    | ('Session' | 'SponsorSession' | 'KeynoteSession' | 'Intermission')
    | undefined
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
  allowShowingVideo?: boolean | undefined
  offlineParticipationCount: number
  onlineParticipationCount: number
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
export const {
  useGetApiV1ByEventAbbrMyProfileQuery,
  usePostApiV1CheckInEventsMutation,
  usePostApiV1CheckInTalksMutation,
  useGetApiV1EventsQuery,
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1TracksQuery,
  useGetApiV1TracksByTrackIdQuery,
  useGetApiV1StreamingsQuery,
  useGetApiV1SpeakersQuery,
  useGetApiV1ProposalsQuery,
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
} = injectedRtkApi
