import { Handler } from '@netlify/functions';

export type Event = Parameters<Handler>[0];

export type VideoTypeResponse = {
  conferenceId: string;
  embeddableLink: string;
  length: string;
  link: string;
  presenter: string;
  split?: string;
  title: string;
};

export type VideoType = VideoTypeResponse & {
  id: string;
};

export type MappedConferenceInner = {
  title: string;
  website: string;
  date: string;
  videos: string[];
};

export type UnmappedConference = {
  website: string;
  date: string;
  videos: string;
  title: string;
};

export type RedisResponseData = [number, ...Array<string | string[]>];

type RedisBaseResponse<T extends Record<string, unknown>> = Array<
  [Error | null, T]
>;

export type RedisGetVideosResponse = RedisBaseResponse<VideoTypeResponse>;
export type RedisGetConferencesResponse = RedisBaseResponse<UnmappedConference>;

// intermediate representations
export type MappedVideo = {
  id: string;
  video: VideoType;
};

export type MappedConferenceWithoutVideos = {
  id: string;
  conference: MappedConferenceInner;
};

// result format
export type ResultConference = {
  id: string;
  website: string;
  date: string;
  title: string;
  videos: VideoType[];
};

export type ProcessedResultType = ResultConference[];
