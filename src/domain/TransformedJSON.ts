import { ConferenceInput, PresenterInput } from "./InputJSON";

export type VideoTransformed = {
    title: string;
    link: string;
    length: string;
    split: string;
    lightning?: boolean;
    presenter: PresenterInput;
    embeddableLink: string;
    conference?: Omit<ConferenceInput, "videos">
};

export type ConferenceTransformed = {
    title: string;
    date: string;
    website: string;
    playlist: string;
    videos: VideoTransformed[];
};

export type Conferences = ConferenceTransformed[];