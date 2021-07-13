import Redis from 'ioredis';
import { logger } from './logger';
import {
  MappedConferenceWithoutVideos,
  MappedVideo,
  RedisGetConferencesResponse,
  RedisGetVideosResponse,
  RedisResponseData,
} from './models';

const REDIS_PREFIX = process.env.REDIS_PREFIX;
const DELIMITER = '_';

const redis = new Redis(process.env.DBPATH);

export const getConference = async (query: string) => {
  const conferenceResults: RedisResponseData = await redis.send_command(
    'FT.SEARCH',
    `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}conference`,
    query
  );

  return conferenceResults;
};

export const searchConferences = async (query: string) => {
  const conferenceResults = await redis.send_command(
    'FT.SEARCH',
    `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}conference`,
    query,
    'HIGHLIGHT',
    ...'TAGS <b><i> </i></b>'.split(' ')
  );

  return conferenceResults;
};

export const searchVideos = async (
  query: string,
  conference?: MappedConferenceWithoutVideos
) => {
  const AND = query && !!conference ? ' & ' : '';
  const redisSearch = `${query ? `(@title|presenter:(${query}))` : ''} ${AND} ${
    conference?.id ? `@conferenceId:${conference.id}` : ''
  }`;
  try {
    const videoResults: RedisResponseData = await redis.send_command(
      'FT.SEARCH',
      `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}video`,
      redisSearch,
      'HIGHLIGHT',
      ...'FIELDS 2 title presenter'.split(' '),
      ...'TAGS <i> </i>'.split(' '),
      ...'LIMIT 0 10000'.split(' ')
    );

    return videoResults;
  } catch (error) {
    logger.error('QUERY::', redisSearch);
    throw error;
  }
};

export const getVideoIds = async (
  start: number,
  stop: number
): Promise<string[]> => {
  const videoResults = await redis.zrange(
    `${REDIS_PREFIX}${DELIMITER}videos${DELIMITER}videos_by_date`,
    start,
    stop
  );

  return videoResults;
};

export const getVideos = async (videos: string[]) => {
  const queries: string[] = [];
  const pipeline = redis.pipeline();
  for (const video of videos) {
    queries.push(video);
    pipeline.hgetall(video);
  }

  const results: RedisGetVideosResponse = await pipeline.exec();

  return [queries, results] as const;
};

export const getConferences = async (videos: MappedVideo[]) => {
  const queries: string[] = [];
  const pipeline = redis.pipeline();
  const conferenceSet = new Set(
    videos.map((video) => video.video.conferenceId)
  );

  for (const conferenceId of Array.from(conferenceSet)) {
    queries.push(conferenceId);
    pipeline.hgetall(conferenceId);
  }

  const results: RedisGetConferencesResponse = await pipeline.exec();

  return [queries, results] as const;
};
