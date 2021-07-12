import { ConferenceInput } from './InputJSON';

export type VideoTransformed = {
  id: string;
  title: string;
  link: string;
  length: string;
  split: string;
  lightning?: boolean;
  presenter: string;
  embeddableLink: string;
  conference?: Omit<ConferenceInput, 'videos'>;
};

export type ConferenceTransformed = {
  title: string;
  date: string;
  website: string;
  playlist: string;
  videos: VideoTransformed[];
};

export type Conferences = ConferenceTransformed[];
