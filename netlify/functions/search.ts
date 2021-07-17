import { Handler } from '@netlify/functions';
import Redis from 'ioredis';

import {
  Event,
  MappedConferenceWithoutVideos,
  ProcessedResultType,
  VideoType,
} from './utils/models';

import { cleanInputs } from './utils/cleanInputs';

import { conferencesToObject, videosToObject } from './utils/transformers';
import { logger } from './utils/logger';

import * as Services from './utils/services';

const REDIS_PREFIX = process.env.REDIS_PREFIX;
const DELIMITER = '_';

const redis = new Redis(process.env.DBPATH);

const getConference = async (event: Event) => {
  const conference = event.queryStringParameters?.conference;
  const query = `@title:${conference}`;

  try {
    const conferenceResults = await Services.getConference(query);

    if (
      !conferenceResults ||
      conferenceResults[0] !== 1 ||
      typeof conferenceResults[1] !== 'string'
    ) {
      throw new Error('Conference not found');
    }

    // return conference id
    const conferences = conferencesToObject(conferenceResults);

    return conferences[0];
  } catch (error) {
    logger.error(error);
    logger.error('QUERY::', query);
    error.statusCode = 404;
    throw error;
  }
};

const searchConferences = async (event: Event) => {
  const query = event.queryStringParameters?.query ?? '';
  try {
    const conferenceResults = await Services.searchConferences(query);

    if (!conferenceResults) {
      return null;
    }

    const conferencesAsObjects = conferencesToObject(conferenceResults);

    // and get all videos for conferences that matched...
    const queries: string[] = [];
    const pipeline = redis.pipeline();
    for (const conference of conferencesAsObjects) {
      for (const videoId of conference.conference.videos) {
        queries.push(`${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`);
        pipeline.hgetall(
          `${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`
        );
      }
    }

    const results = (await pipeline.exec()) as Array<[Error, VideoType]>;
    const newResults = results.map(
      ([_, result]: [Error, VideoType], index: number) => {
        return {
          ...result,
          id: queries[index],
        };
      }
    );

    const processedResults: ProcessedResultType = [];
    for (const conference of conferencesAsObjects) {
      const newConference = {
        ...conference.conference,
        id: conference.id,
        videos: conference.conference.videos
          .filter((videoId: string) =>
            newResults.find(
              (video: VideoType) =>
                video.id ===
                `${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`
            )
          )
          .map((videoId: string) => {
            const video = newResults.find(
              (video: VideoType) =>
                video.id ===
                `${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`
            );

            return video as VideoType;
          }),
      };
      processedResults.push(newConference);
    }

    return processedResults;
  } catch (error) {
    logger.error(error);
    logger.error('QUERY::', query);
    throw error;
  }
};

// high limit based on
const searchVideos = async (
  event: Event,
  conference?: MappedConferenceWithoutVideos
) => {
  const query = event.queryStringParameters?.query ?? '';

  try {
    const videoResults = await Services.searchVideos(query, conference);

    if (!videoResults) {
      return null;
    }

    const videosAsObjects = videosToObject(videoResults);

    const [queries, results] = await Services.getConferences(videosAsObjects);

    const newResults = results.map(([, result], index: number) => {
      return {
        id: queries[index],
        conference: result,
      };
    });

    const conferenceMap = new Map();
    const newNewResults: ProcessedResultType = [];
    for (const conference of newResults) {
      const newConference = {
        ...conference.conference,
        id: conference.id,
        videos: [],
      };
      newNewResults.push(newConference);
      conferenceMap.set(conference.id, newConference);
    }

    for (const video of videosAsObjects) {
      const conference = conferenceMap.get(video.video.conferenceId);
      conference.videos.push({
        ...video.video,
      });
    }

    return newNewResults;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const mergeResults = (
  conferenceResults: ProcessedResultType,
  videoResults: ProcessedResultType
) => {
  const results = [...conferenceResults];

  // go through conferences, and see if there is a matching result in the videoResults.
  // if so, replace conferenceResults video with one in videoResults
  for (const conf of results) {
    const matchingConference = videoResults.find(
      (conference) => conference.id === conf.id
    );

    // if there is a matching conference, replace matching videos...
    if (matchingConference) {
      for (const video of matchingConference.videos) {
        // replace matching video from conferenceResults with one in videoResults
        const index = conf.videos.findIndex((vid) => vid.id === video.id);
        if (index > -1) {
          conf.videos[index] = video;
        }
      }
    }
  }

  // finally merge in any remaning videos from conferences not in conferenceResults...
  for (const conf of videoResults) {
    const found = results.findIndex((conference) => conf.id === conference.id);
    if (found === -1) {
      results.push(conf);
    }
  }

  return results;
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const updatedEvent = {
    ...event,
    queryStringParameters: event.queryStringParameters
      ? event.queryStringParameters
      : {},
  };

  if (
    event.queryStringParameters?.query === undefined &&
    event.queryStringParameters?.conference === undefined
  ) {
    return { statusCode: 400, body: 'Invalid Request' };
  }

  updatedEvent.queryStringParameters.query = cleanInputs(
    updatedEvent.queryStringParameters.query ?? ''
  );

  try {
    let conference: MappedConferenceWithoutVideos | undefined;
    let conferenceResults: ProcessedResultType | null | undefined;
    if (updatedEvent.queryStringParameters?.conference) {
      conference = await getConference(updatedEvent);
    } else {
      conferenceResults = await searchConferences(updatedEvent);
    }

    const videoResults = await searchVideos(updatedEvent, conference);

    const results =
      !!conferenceResults && !!videoResults
        ? mergeResults(conferenceResults, videoResults)
        : conferenceResults || videoResults;

    return {
      statusCode: 200,
      body: JSON.stringify(results, null, 2),
    };
  } catch (e) {
    logger.error(e);

    return {
      statusCode: e.statusCode || 500,
      body: e.toString(),
    };
  }
};

export { handler };
