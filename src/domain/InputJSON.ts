/* Definitions for input JSON file read in */
export type PresenterInput = {
  name: string;
};

export type VideoInput = {
  title: string;
  link: string;
  length: string;
  split: string;
  presenter: PresenterInput;
};

export type ConferenceInput = {
  title: string;
  date: string;
  website: string;
  playlist: string;
  videos: VideoInput[];
};

export type JSONInput = ConferenceInput[];
