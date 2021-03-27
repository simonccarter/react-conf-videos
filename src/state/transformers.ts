import axios from 'axios';
import { JSONInput, ConferenceInput, VideoInput } from 'domain/InputJSON';
import { Conferences } from 'domain/TransformedJSON';
import { omit, sort } from 'ramda';

const sortByDate = sort<ConferenceInput>(
  (a: ConferenceInput, b: ConferenceInput) => {
    const [aD, aM, aY] = a.date.split('-');
    const [bD, bM, bY] = b.date.split('-');

    // 1t first compare years for difference
    if (parseFloat(aY) < parseFloat(bY)) {
      return 1;
    } else if (parseFloat(aY) > parseFloat(bY)) {
      return -1;
    }

    // otherwise look at months
    if (parseFloat(aM) < parseFloat(bM)) {
      return 1;
    } else if (parseFloat(aM) > parseFloat(bM)) {
      return -1;
    }

    // finally look at days
    if (parseFloat(aD) < parseFloat(bD)) {
      return 1;
    } else if (parseFloat(aD) > parseFloat(bD)) {
      return -1;
    }

    // they are the same
    return 0;
  }
);

const addEmbeddableLinksToVideos = (data: JSONInput): Conferences => {
  const linkReg = /https:?\/\/www\.youtube\.com\/watch\?v=(.*?)\&.*$/;
  return data.map((conference: ConferenceInput) => {
    const videos = conference.videos || [];
    const nVideos = videos.map((video: VideoInput) => {
      const embeddableLink = video.link.replace(
        linkReg,
        'https://www.youtube.com/embed/$1'
      );
      return Object.assign({}, video, { embeddableLink });
    });
    return Object.assign({}, conference, { videos: nVideos });
  });
};

const mapConferenceDetailsOntoVideo = (conference: ConferenceInput) => (
  video: VideoInput
) => ({
  ...video,
  conference: omit(['videos'], conference)
});

const addConferenceDetails = (data: Conferences): Conferences => {
  return data.map(conference => {
    const videos = conference.videos || [];
    const nVideos = videos.map(mapConferenceDetailsOntoVideo(conference));
    return Object.assign({}, conference, { videos: nVideos });
  });
};

export const transformDataFromJson = (data: JSONInput): Conferences => {
  // sort confs by date
  const confs = sortByDate(data);

  // add embeddable links to videos
  const dataWithEmbeddableLinks = addEmbeddableLinksToVideos(confs);
  const withConferenceDetails = addConferenceDetails(dataWithEmbeddableLinks);
  return withConferenceDetails;
};

export const loadData = async () => {
  const response = await axios.get('/assets/conferenceVids.json');
  return transformDataFromJson(response.data);
};
