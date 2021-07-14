import { Handler } from '@netlify/functions';
import {
  Event,
  MappedVideo,
  RedisGetVideosResponse,
  ResultConference,
} from './utils/models';
import * as Services from './utils/services';

// FIX TYPES
const videosToObject = (
  data: RedisGetVideosResponse,
  queries: string[]
): MappedVideo[] => {
  return data.reduce((acc, [_, video], index) => {
    return [
      ...acc,
      {
        id: queries[index],
        video: {
          ...video,
          id: queries[index],
        },
      },
    ];
  }, [] as MappedVideo[]);
};

const getVideoIds = async ({
  start,
  stop,
}: {
  start?: number;
  stop?: number;
  page?: number;
}) => {
  const START = start || 0;
  const STOP = stop || (START ? START + 19 : 19);

  const videoResults = await Services.getVideoIds(START, STOP);

  return !videoResults || !videoResults.length ? [] : videoResults;
};

const getVideos = async (videos: string[]) => {
  const [queries, results] = await Services.getVideos(videos);

  return videosToObject(results, queries);
};

const getConferences = async (videos: MappedVideo[]) => {
  const [queries, results] = await Services.getConferences(videos);

  const newResults = results.map(([, result], index) => {
    return {
      ...result,
      id: queries[index],
    };
  });

  const conferenceMap = new Map();
  const conferencesWithVideos: ResultConference[] = newResults.map(
    (conference) => ({
      ...conference,
      videos: [],
    })
  );

  for (const conference of conferencesWithVideos) {
    conferenceMap.set(conference.id, conference);
  }

  for (const video of videos) {
    const conference = conferenceMap.get(video.video.conferenceId);
    conference.videos.push(video.video);
  }

  return conferencesWithVideos;
};

const getList = async (event: Event) => {
  // get video ids
  const videoResults = await getVideoIds({
    start: Number(event.queryStringParameters?.start),
    stop: Number(event.queryStringParameters?.stop),
  });

  if (!videoResults) {
    return [];
  }

  // now get videos
  const videos = await getVideos(videoResults);

  // get conferences and map to conference => videos
  const results = await getConferences(videos);

  return results;
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (
    event.queryStringParameters?.start &&
    Number.isNaN(Number(event.queryStringParameters.start))
  ) {
    return { statusCode: 400, body: 'Invalid Request' };
  }

  if (
    event.queryStringParameters?.stop &&
    Number.isNaN(Number(event.queryStringParameters.stop))
  ) {
    return { statusCode: 400, body: 'Invalid Request' };
  }

  try {
    const results = await getList(event);

    return {
      statusCode: 200,
      body: JSON.stringify(results, null, 2),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e,
    };
  }
};

export { handler };
