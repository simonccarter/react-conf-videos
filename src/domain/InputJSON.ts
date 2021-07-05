/* Definitions for input JSON file read in */

export type VideoInput = {
  title: string;
  link: string;
  length: string;
  split: string;
  presenter: string;
  id: string;
};

export type ConferenceInput = {
  title: string;
  date: string;
  website: string;
  playlist: string;
  videos: VideoInput[];
};

export type JSONInput = ConferenceInput[];
