import { Handler } from '@netlify/functions';
import Redis from 'ioredis';

import { Event } from './utils/models';

const REDIS_PREFIX = process.env.REDIS_PREFIX;
const DELIMITER = '_';

const redis = new Redis(process.env.DBPATH);

type VideoType = {
  embeddableLink: string;
  title: string;
  link: string;
  conferenceId: string;
  presenter: string;
  split?: string;
  length: string;
  id: string;
};

type ProcessedResultType = MappedConference[];

type MappedConference = {
  id: string;
  website: string;
  date: string;
  videos: VideoType[];
  title: string;
};

type UnmappedConference = {
  website: string;
  date: string;
  videos: string;
  title: string;
};

const videosToObject = (
  data: Array<[Error | null, Omit<VideoType, 'id'>]>,
  queries: string[]
) => {
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
  }, [] as Array<{ id: string; video: VideoType }>);
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
  const STOP = stop || (START ? START + 20 : 20);

  // get video ids
  const videoResults = await redis.zrange(
    `${REDIS_PREFIX}${DELIMITER}videos${DELIMITER}videos_by_date`,
    START,
    STOP
  );
  return !videoResults ? null : videoResults;
};

const getVideos = async (videos: string[]) => {
  const queries: string[] = [];
  const pipeline = redis.pipeline();
  for (const video of videos) {
    queries.push(video);
    pipeline.hgetall(video);
  }
  const results: Array<[Error | null, VideoType]> = await pipeline.exec();
  return videosToObject(results, queries);
};

const getConferences = async (
  videos: Array<{ id: string; video: VideoType }>
) => {
  const queries: string[] = [];
  const pipeline = redis.pipeline();
  const conferenceSet = new Set(
    videos.map((video) => video.video.conferenceId)
  );
  for (const conferenceId of Array.from(conferenceSet)) {
    queries.push(conferenceId);
    pipeline.hgetall(conferenceId);
  }

  const results = (await pipeline.exec()) as Array<[Error, UnmappedConference]>;

  const newResults = results.map(([_, result], index) => {
    return {
      ...result,
      id: queries[index],
    };
  });

  const conferenceMap = new Map();
  const conferencesWithVideos: ProcessedResultType = newResults.map(
    (conference) => {
      return {
        ...conference,
        videos: [],
      };
    }
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
    return null;
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
