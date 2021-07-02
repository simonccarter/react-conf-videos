const fs = require('fs')
const path = require('path')
const redis = require("redis");

const util = require('util');

const transformDataFromJson = require('./json2redis.js')

const Redisearch = require('redis-modules-sdk').Redisearch;

// FT.CREATE idx:conference ON HASH PREFIX 1 "conference:" SCHEMA title TEXT SORTABLE
// FT.CREATE idx:video ON HASH PREFIX 1 "video:" SCHEMA title TEXT SORTABLE presenter TEXT SORTABLE

const client = redis.createClient({
  url:
    'redis://cu9SdIG02zdPrS9oVeucG0Bx1WCqY08j@redis-17408.c273.us-east-1-2.ec2.cloud.redislabs.com:17408'
})

client.EXISTS = util.promisify(client.EXISTS);
client.RPUSH = util.promisify(client.RPUSH);
client.DEL = util.promisify(client.DEL);
client.EXISTS = util.promisify(client.EXISTS);
client.HMSET = util.promisify(client.HMSET);
client.ZADD = util.promisify(client.ZADD);

client.on("error", function(error) {
  console.error(error);
});

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/conferenceVids.json'), 'utf-8'))
const transformedData = transformDataFromJson(data)

// fs.writeFileSync(path.join(__dirname, './output.json'), JSON.stringify(transformedData,null,2))

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

const createMapOfVideosToConferences = (data) => {
    let map = new Map() // video => conference
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

const main = async (data) => {
    const mappedVideosToConferences = createMapOfVideosToConferences(data)

    // #1 store videos
    for (let videoId in transformedData.videos){
        const originalVideo = transformedData.videos[videoId]
        const video = {
            ...originalVideo,
            conferenceId: mappedVideosToConferences.get(videoId)
        }

        client.HMSET(`video:${videoId}`, toArray(video))
    }

    // #2 store conferences
    for(let conferenceId in transformedData.conferences){
        if (!transformedData.conferences[conferenceId].videos.length){
            continue;
        }

        // add list of conference videos
        // let key = `conference:${conferenceId}:videos`
        // const exists = await client.EXISTS(key)
        // if(exists){
        //     await client.DEL(key)
        // }
        // const sortedSet = transformedData.conferences[conferenceId].videos.reduce((acc, element, index) => {
        //     acc.push([index, element])
        //     return acc;
        // }, []).flat()
        // console.log(`conference:${conferenceId}:videos`)
        // await client.ZADD(`conference:${conferenceId}:videos`, sortedSet)

        // # add conference
        key = `conference:${conferenceId}`
        conference = transformedData.conferences[conferenceId];
        conference.videos = conference.videos.join(' ||| ');
        delete conference.playlist

        client.HMSET(key, toArray(conference))
    }
    return;
}


main(data);

// createIndexes = async () => {
//     await client.FT.CREATE
// }