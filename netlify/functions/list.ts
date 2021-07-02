import Redis from 'ioredis';
import { Handler } from '@netlify/functions';

const REDIS_PREFIX = process.env.REDIS_PREFIX

type Event = Parameters<Handler>[0]

const redis = new Redis(process.env.DBPATH);

type VideoType = {
  embeddableLink: string;
  title: string;
  link: string;
  conferenceId: string;
  presenter: string;
  split?: string;
  length: string;
};

const videosToObject = (data: [Error | null, VideoType][], queries: string[]) => {
  return data.reduce(
    (acc, [error, video], index) => {
      return [
        ...acc,
        {
          id: queries[index],
          video
        }
      ];
    },
    [] as { id: string; video: VideoType }[]
  );
};

const getVideoIds = async ({
  start,
  stop,
  page
}: {
  start?: number;
  stop?: number;
  page?: number;
}) => {
  let START = start || 0;
  let STOP = stop || (START ? START + 20 : 20);

  // get video ids
  const videoResults = await redis.zrange(`${REDIS_PREFIX}:videos:videos_by_date`, START, STOP);
  return !videoResults ? null : videoResults;
};

const getVideoHashes = async (videos: string[]) => {
  const queries: string[] = [];
  const pipeline = redis.pipeline();
  for (let video of videos) {
    queries.push(video);
    pipeline.hgetall(video);
  }
  const results: [Error | null, VideoType][] = await pipeline.exec();
  return videosToObject(results, queries);
};

const getConferences = async (videos: any[]) => {
  const queries: string[] = [];
  const pipeline = redis.pipeline();
  const conferenceSet = new Set(videos.map(video => video.video.conferenceId));
  for (let conferenceId of Array.from(conferenceSet)) {
    queries.push(conferenceId);
    pipeline.hgetall(conferenceId);
  }

  const results = (await pipeline.exec()) as Array<[Error, any]>;
  const newResults = results.map(([_, result]: [Error, any], index: number) => {
    return {
      id: queries[index],
      conference: result
    };
  });

  const conferenceMap = new Map();
  for (let conference of newResults) {
    delete conference.conference.videos;
    conferenceMap.set(conference.id, conference.conference);
  }

  for (let video of videos) {
    const conference = conferenceMap.get(video.video.conferenceId);
    if (conference.videos) {
      conference.videos.push(video.video);
    } else {
      conference.videos = [video.video];
    }
  }

  return newResults;
};

const getVideos = async (event: Event) => {
  // get video ids
  const videoResults = await getVideoIds({
    start: Number(event.queryStringParameters?.start),
    stop: Number(event.queryStringParameters?.stop),
  });
  if (!videoResults) return null;

  // now get video hashes
  const videos = await getVideoHashes(videoResults);

  // get conferences and map to conference => videos
  const results = await getConferences(videos);

  return results;
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if(event.queryStringParameters?.start && isNaN(Number(event.queryStringParameters.start))){
    return { statusCode: 400, body: 'Invalid Request'}; 
  }

  if(event.queryStringParameters?.stop && isNaN(Number(event.queryStringParameters.stop))){
    return { statusCode: 400, body: 'Invalid Request'}; 
  }

  try {
    const results = await getVideos(event);

    return {
      statusCode: 200,
      body: JSON.stringify(results, null, 2)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e
    };
  }
};

export { handler };
