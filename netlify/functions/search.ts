import Redis from 'ioredis';
import { Handler } from '@netlify/functions';

type Event = Parameters<Handler>[0]

const redis = new Redis(process.env.DBPATH);

type VideoType = {
    embeddableLink: string,
    title: string,
    link: string,
    conferenceId: string,
    presenter: string,
    split: string,
    length: string,
}

const toObject = (data: any[]) => {
  return data.reduce((acc, key, index) => {
    if(index%2 === 0){
      let value = data[index+1] 
      if(key === 'videos'){
        value = data[index+1].split(' ||| ')
      }
      acc = {
        ...acc,
        [key]: value
      }
    }
    return acc;
  }, {})
}

const conferencesToObject = (data: any[]) => {
  data.splice(0,1);
  return data.reduce((acc, key, index) => {
    if(index%2 === 0){
      acc = [
        ...acc,
        {
          id: key, 
          conference: toObject(data[index+1])
        }
      ]
    }
    return acc;
  }, [])
}

const videosToObject = (data: any[]) => {
  data.splice(0,1);
  return data.reduce((acc, key, index) => {
    if(index%2 === 0){
      acc = [
        ...acc,
        {
          id: key, 
          video: toObject(data[index+1])
        }
      ]
    }
    return acc;
  }, [])
}

const searchConferences = async (event: Event) => {
  const conferenceResults = await redis.send_command('FT.SEARCH', 'idx:conference', event.queryStringParameters?.query as string, "HIGHLIGHT")
  if (!conferenceResults) return null;

  const conferencesAsObjects = conferencesToObject(conferenceResults)

  // and get all videos for conferences that matched...
  const queries: string[]= []
  const pipeline = redis.pipeline();
  for(let conference of conferencesAsObjects){
    for(let videoId of conference.conference.videos){
      queries.push(`video:${videoId}`)
      pipeline.hgetall(`video:${videoId}`)
    }
  } 

  const results = await pipeline.exec() as Array<[Error, VideoType]>
  const newResults = results.map(([_, result]: [Error, VideoType], index: number) => {
    return {
      id: queries[index],
      video: result
    }
  })

  for(let conference of conferencesAsObjects){
    conference.conference.videos = conference.conference.videos.map((videoId: string) => {
      const video = newResults.find((video: any) => video.id === `video:${videoId}`)
      return video?.video
    })
  }

  return conferencesAsObjects
}

const searchVideos = async (event: Event) => {
  const videoResults = await redis.send_command('FT.SEARCH', 'idx:video', event.queryStringParameters?.query as string);
  if(!videoResults) return null;

  const videosAsObjects = videosToObject(videoResults)

  // now get conferences for these videos, replacing their videos object with the callee
  const queries: string[]= []
  const pipeline = redis.pipeline();
  for(let video of videosAsObjects){
    queries.push(video.video.conferenceId)
    pipeline.hgetall(video.video.conferenceId)
  } 

  const results = await pipeline.exec() as Array<[Error, any]>
  const newResults = results.map(([_, result]: [Error, any], index: number) => {
    return {
      id: queries[index],
      conference: result
    }
  })

  const conferenceMap = new Map()
  for(let conference of newResults){
    delete conference.conference.videos
    conferenceMap.set(conference.id, conference.conference)
  }

  for(let video of videosAsObjects){
    const conference = conferenceMap.get(video.video.conferenceId)
    if(conference.videos){
      conference.videos.push(video.video)
    }else{
      conference.videos = [video.video]
    }
  }

  return newResults
}

type ProcessedResultType = Array<{
  id: string,
  conference: {
    website: string
    date: string,
    videos: Array<{
      "embeddableLink": string
      "title": string
      "link": string,
      "conferenceId": string
      "presenter": string
      "length": string
    }>
  }
}>

const mergeResults = (conferenceResults: ProcessedResultType, videoResults: ProcessedResultType) => {
  const results = [...conferenceResults]
  for(let conf of videoResults){
    const found = results.findIndex(_conf => conf.id === _conf.id)
    if(found === -1){
      results.push(conf)
    }
  }
  return results
}

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (event.queryStringParameters?.query === undefined){
    return { statusCode: 400, body: 'Invalid Request' };
  }

  try {
    const conferenceResults = await searchConferences(event)
    const videoResults = await searchVideos(event)

    const results = !!conferenceResults && !!videoResults ? mergeResults(conferenceResults, videoResults) : conferenceResults || videoResults

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
