import fs from 'fs';
import path from 'path';
import Redis from 'ioredis';
import he from 'he';
import { config } from 'dotenv';

import { transformDataFromJson } from './json2redis';

config();

const REDIS_PREFIX = process.env.REDIS_PREFIX;
const DELIMITER = '_';

// FT.CREATE idx:conference ON HASH PREFIX 1 "conference:" SCHEMA title TEXT SORTABLE
// FT.CREATE idx:video ON HASH PREFIX 1 "video:" SCHEMA title TEXT SORTABLE presenter TEXT SORTABLE

if (!process.env.DBPATH) {
  console.error('Missing process.env.DBPATH');
  process.exit();
}

if (!process.env.REDIS_PREFIX) {
  console.error('Missing process.env.REDIS_PREFIX');
  process.exit();
}

const client = new Redis(process.env.DBPATH);

client.on('error', function callback(error) {
  console.error(error);
});

const data = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../public/assets/conferenceVids.json'),
    'utf-8'
  )
);
const transformedData = transformDataFromJson(data);

const toArray = (obj) => {
  const transformed = Object.keys(obj)
    .map((key) => {
      let value = obj[key];
      if (key === 'presenter') {
        value = obj.presenter.name;
      }
      value = typeof value === 'string' ? he.encode(value) : value;

      return [key, value];
    })
    .flat();

  return transformed;
};

const createMapOfVideosToConferences = () => {
  const map = new Map();

  for (const conferenceId in transformedData.conferences) {
    if (!transformedData.conferences[conferenceId].videos.length) {
      continue;
    }

    for (const videoId of transformedData.conferences[conferenceId].videos) {
      map.set(videoId, conferenceId);
    }
  }

  return map;
};

const storeVideos = async () => {
  const mappedVideosToConferences = createMapOfVideosToConferences();
  const pipeline = client.pipeline();

  for (const videoId in transformedData.videos) {
    const originalVideo = transformedData.videos[videoId];
    const video = {
      ...originalVideo,
      conferenceId: `${REDIS_PREFIX}${DELIMITER}conference${DELIMITER}${mappedVideosToConferences.get(
        videoId
      )}`,
    };

    pipeline.hmset(
      `${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`,
      toArray(video)
    );
  }
  await pipeline.exec();
};

const storeConferences = async () => {
  const pipeline = client.pipeline();
  for (const conferenceId in transformedData.conferences) {
    if (!transformedData.conferences[conferenceId].videos.length) {
      continue;
    }

    const key = `${REDIS_PREFIX}${DELIMITER}conference${DELIMITER}${conferenceId}`;
    const conference = transformedData.conferences[conferenceId];
    conference.videos = conference.videos.join(' ||| ');
    delete conference.playlist;

    pipeline.hmset(key, toArray(conference));
  }
  await pipeline.exec();
};

const storeVideosSortedByDate = async () => {
  const queries: Array<string | number> = [];
  let score = 0;
  for (const videoId in transformedData.videos) {
    queries.push(
      ...[score, `${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`]
    );
    score += 1;
  }

  await client.zadd(
    `${REDIS_PREFIX}${DELIMITER}videos${DELIMITER}videos_by_date`,
    queries
  );
};

const clearAll = async () => {
  const keys = await client.keys(`${REDIS_PREFIX}${DELIMITER}*`);
  const pipeline = client.pipeline();
  for (const key of keys) {
    pipeline.del(key);
  }

  pipeline.send_command(
    'FT.DROPINDEX',
    `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}conference`
  );
  pipeline.send_command(
    'FT.DROPINDEX',
    `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}video`
  );

  await pipeline.exec();
};

const createIndexes = async () => {
  await client.send_command(
    'FT.CREATE',
    `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}conference ON HASH PREFIX 1 ${REDIS_PREFIX}${DELIMITER}conference${DELIMITER} SCHEMA title TEXT SORTABLE`.split(
      ' '
    )
  );
  await client.send_command(
    'FT.CREATE',
    `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}video ON HASH PREFIX 1 ${REDIS_PREFIX}${DELIMITER}video${DELIMITER} SCHEMA title TEXT SORTABLE presenter TEXT SORTABLE conferenceId TEXT SORTABLE`.split(
      ' '
    )
  );
};

const main = async () => {
  console.log('flushing redis');
  await clearAll();

  console.log('storing videos');
  await storeVideos();

  console.log('storing conferences');
  await storeConferences();

  console.log('storing sorted videos');
  await storeVideosSortedByDate();

  console.log('creating indexes');
  await createIndexes();

  console.log('disconnecting');
  await client.disconnect();
};

main();
