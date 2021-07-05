const fs = require('fs')
const path = require('path');
const Redis = require('ioredis');

require('dotenv').config();

const transformDataFromJson = require('./json2redis.js');

const REDIS_PREFIX = process.env.REDIS_PREFIX

// FT.CREATE idx:conference ON HASH PREFIX 1 "conference:" SCHEMA title TEXT SORTABLE
// FT.CREATE idx:video ON HASH PREFIX 1 "video:" SCHEMA title TEXT SORTABLE presenter TEXT SORTABLE

if(!process.env.DBPATH){
    console.error('Missing process.env.DBPATH')
    process.exit() 
}

if(!process.env.REDIS_PREFIX){
    console.error('Missing process.env.REDIS_PREFIX')
    process.exit() 
}

const client = new Redis(process.env.DBPATH);

client.on("error", function(error) {
  console.error(error);
});

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/conferenceVids.json'), 'utf-8'))
const transformedData = transformDataFromJson(data)

const toArray = (obj) => {
    const transformed = Object.keys(obj).map((key) =>{
        let value = obj[key]
        if(key === "presenter"){
            value = obj.presenter.name
        }
        return [key, value]
    }).flat();
    return transformed;
}

const createMapOfVideosToConferences = () => {
    let map = new Map() 
    for(let conferenceId in transformedData.conferences){
        if (!transformedData.conferences[conferenceId].videos.length){
            continue;
        }

        for(let videoId of transformedData.conferences[conferenceId].videos){
            map.set(videoId, conferenceId)
        }
    }
    return map
}

const storeVideos = async () => {
    const mappedVideosToConferences = createMapOfVideosToConferences(transformedData)
    const pipeline = client.pipeline()

    for (let videoId in transformedData.videos){
        const originalVideo = transformedData.videos[videoId]
        const video = {
            ...originalVideo,
            conferenceId: `${REDIS_PREFIX}:conference:${mappedVideosToConferences.get(videoId)}`
        }

        pipeline.hmset(`${REDIS_PREFIX}:video:${videoId}`, toArray(video))
    }
    await pipeline.exec()

    return
}

const storeConferences = async (data) => {
    const pipeline = client.pipeline()
    for(let conferenceId in transformedData.conferences){
        if (!transformedData.conferences[conferenceId].videos.length){
            continue;
        }

        key = `${REDIS_PREFIX}:conference:${conferenceId}`
        conference = transformedData.conferences[conferenceId];
        conference.videos = conference.videos.join(' ||| ');
        delete conference.playlist

        pipeline.hmset(key, toArray(conference))
    }
    await pipeline.exec()

    return
}

const storeVideosSortedByDate = async (data) => {
    const queries = [];
    let score = 0;
    for (let videoId in transformedData.videos){
        queries.push(...[score, `${REDIS_PREFIX}:video:${videoId}`])
        score++
    }

    await client.zadd(`${REDIS_PREFIX}:videos:videos_by_date`, queries);
    return;
}

const clearAll = async () => {
    const keys = await client.keys(`${REDIS_PREFIX}:*`);
    const pipeline = client.pipeline()
    for(let key of keys){
        pipeline.del(key)
    }

    pipeline.send_command('FT.DROPINDEX', `${REDIS_PREFIX}:idx:conference`)
    pipeline.send_command('FT.DROPINDEX', `${REDIS_PREFIX}:idx:video`)
    
    const result = await pipeline.exec()
    console.log(result[result.length-2], result[result.length-1])
    return;
}

const createIndexes = async () => {
    await client.send_command('FT.CREATE', `${REDIS_PREFIX}:idx:conference ON HASH PREFIX 1 ${REDIS_PREFIX}:conference: SCHEMA title TEXT SORTABLE`.split(' '))
    await client.send_command('FT.CREATE', `${REDIS_PREFIX}:idx:video ON HASH PREFIX 1 ${REDIS_PREFIX}:video: SCHEMA title TEXT SORTABLE presenter TEXT SORTABLE conferenceId TEXT SORTABLE`.split(' '))
}

const main = async () => {
    console.log('flushing redis')
    await clearAll()

    console.log('storing videos')
    await storeVideos();

    console.log('storing conferences')
    await storeConferences()

    console.log('storing sorted videos')
    await storeVideosSortedByDate()

    console.log('creating indexes')
    await createIndexes()

    console.log('disconnecting')
    await client.disconnect()

    return;
}

main();
