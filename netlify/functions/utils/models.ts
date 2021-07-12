import { Handler } from '@netlify/functions';

export type Event = Parameters<Handler>[0];

export type VideoType = {
  id: string;
  embeddableLink: string;
  title: string;
  link: string;
  conferenceId: string;
  presenter: string;
  split: string;
  length: string;
};

export type MappedVideo = {
  id: string;
  video: Omit<VideoType, 'id'>;
};

export type MapperConferenceInner = {
  title: string;
  website: string;
  date: string;
  videos: string[];
};

export type MappedConference = {
  id: string;
  conference: MapperConferenceInner;
};

export type UnmappedConference = {
  website: string;
  date: string;
  videos: string;
  title: string;
};

export type ProcessedResultType = Array<{
  id: string;
  website: string;
  date: string;
  title: string;
  videos: VideoType[];
}>;

export type RedisResponseData = [number, ...Array<string | string[]>];
