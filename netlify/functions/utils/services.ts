import * as Redis from 'ioredis';
import { RedisResponseData } from './models';

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
