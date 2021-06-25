const fs = require('fs')
const path = require('path')
const transformDataFromJson = require('./scripts/json2redis.js')

const redis = require("redis");
const client = redis.createClient({
    url: 'redis://cu9SdIG02zdPrS9oVeucG0Bx1WCqY08j@redis-17408.c273.us-east-1-2.ec2.cloud.redislabs.com:17408',
});

client.on("error", function(error) {
  console.error(error);
});

const data = JSON.parse(fs.readFileSync(path.join(__dirname, './public/assets/conferenceVids.json'), 'utf-8'))
const transformedData = transformDataFromJson(data)

const toArray = (obj) => {
    const what = Object.keys(obj).map((key) =>{
        let value = obj[key]
        if(key === "presenter"){
            value = obj.presenter.name
        }
        return [key, value]
    }).flat();
    return what;
}

for (let videoId in transformedData.videos){
    client.hmset(`video:${videoId}`, toArray(JSON.stringify(transformedData.videos[videoId])), function(err, reply) {
        if (err) throw err;
    });
}

for(let conferenceId in transformedData.conferences){
    const videos = transformedData.conferences[conferenceId].videos;
    client.hmset(`conference:${conferenceId}:videos`, conferenceId , JSON.stringify(transformedData.conferences[conferenceId]), function(err, reply) {
        if (err) throw err;
    });

    // client.hmset(`conference${conferenceId}`, conferenceId , JSON.stringify(transformedData.conferences[conferenceId]), function(err, reply) {
    //     if (err) throw err;
    // });
}