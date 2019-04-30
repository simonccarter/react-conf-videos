export type Conference = {
  date: string;
  title: string;
  website: string;
  playlist: string;
  videos: string[];
};

export type IndexedConferences = {
  [idx: string]: Conference;
};

export type ConferenceTitlesToIds = {
  [idx: string]: string;
};
