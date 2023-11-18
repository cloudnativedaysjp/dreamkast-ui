/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export enum ChallengeCondition {
  Ready = 'READY',
  Skipped = 'SKIPPED',
  Stamped = 'STAMPED'
}

export enum ConfName {
  Cicd2023 = 'cicd2023',
  Cndf2023 = 'cndf2023',
  Cndt2023 = 'cndt2023'
}

export type CreateViewEventInput = {
  confName: ConfName;
  profileID: Scalars['Int']['input'];
  slotID: Scalars['Int']['input'];
  talkID: Scalars['Int']['input'];
  trackID: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createViewEvent?: Maybe<Scalars['Boolean']['output']>;
  stampOnSite?: Maybe<Scalars['Boolean']['output']>;
  stampOnline?: Maybe<Scalars['Boolean']['output']>;
  viewingTrack?: Maybe<Scalars['Boolean']['output']>;
  vote?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationCreateViewEventArgs = {
  input: CreateViewEventInput;
};


export type MutationStampOnSiteArgs = {
  input: StampOnSiteInput;
};


export type MutationStampOnlineArgs = {
  input: StampOnlineInput;
};


export type MutationViewingTrackArgs = {
  input: ViewingTrackInput;
};


export type MutationVoteArgs = {
  input: VoteInput;
};

export type Query = {
  __typename?: 'Query';
  stampChallenges: Array<Maybe<StampChallenge>>;
  viewerCount: Array<ViewerCount>;
  viewingSlots: Array<ViewingSlot>;
  voteCounts: Array<VoteCount>;
};


export type QueryStampChallengesArgs = {
  confName: ConfName;
  profileID: Scalars['Int']['input'];
};


export type QueryViewerCountArgs = {
  confName?: InputMaybe<ConfName>;
};


export type QueryViewingSlotsArgs = {
  confName: ConfName;
  profileID: Scalars['Int']['input'];
};


export type QueryVoteCountsArgs = {
  confName: ConfName;
  spanSeconds?: InputMaybe<Scalars['Int']['input']>;
  votingTerm?: InputMaybe<VotingTerm>;
};

export type StampChallenge = {
  __typename?: 'StampChallenge';
  condition: ChallengeCondition;
  slotID: Scalars['Int']['output'];
  updatedAt: Scalars['Int']['output'];
};

export type StampOnSiteInput = {
  confName: ConfName;
  profileID: Scalars['Int']['input'];
  slotID: Scalars['Int']['input'];
  talkID: Scalars['Int']['input'];
  trackID: Scalars['Int']['input'];
};

export type StampOnlineInput = {
  confName: ConfName;
  profileID: Scalars['Int']['input'];
  slotID: Scalars['Int']['input'];
};

export type ViewerCount = {
  __typename?: 'ViewerCount';
  count: Scalars['Int']['output'];
  trackName: Scalars['String']['output'];
};

export type ViewingSlot = {
  __typename?: 'ViewingSlot';
  slotId: Scalars['Int']['output'];
  viewingTime: Scalars['Int']['output'];
};

export type ViewingTrackInput = {
  profileID: Scalars['Int']['input'];
  trackName: Scalars['String']['input'];
};

export type VoteCount = {
  __typename?: 'VoteCount';
  count: Scalars['Int']['output'];
  talkId: Scalars['Int']['output'];
};

export type VoteInput = {
  confName: ConfName;
  talkId: Scalars['Int']['input'];
};

export type VotingTerm = {
  end?: InputMaybe<Scalars['DateTime']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
};

export type GetViewerCountQueryVariables = Exact<{
  confName: ConfName;
}>;


export type GetViewerCountQuery = { __typename?: 'Query', viewerCount: Array<{ __typename?: 'ViewerCount', trackName: string, count: number }> };


export const GetViewerCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetViewerCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"confName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfName"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"viewerCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"confName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"confName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackName"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<GetViewerCountQuery, GetViewerCountQueryVariables>;