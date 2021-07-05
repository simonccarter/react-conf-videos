import { Handler } from '@netlify/functions';
import Redis from 'ioredis';
import { match } from 'ramda';

const REDIS_PREFIX = process.env.REDIS_PREFIX
const DELIMITER = "_"

type Event = Parameters<Handler>[0]

const redis = new Redis(process.env.DBPATH);

type VideoType = {
    id: string,
    embeddableLink: string,
    title: string,
    link: string,
    conferenceId: string,
    presenter: string,
    split: string,
    length: string,
}

type MappedVideo = {
  id: string, 
  video: Omit<VideoType, 'id'>
}

type MapperConferenceInner = {
  title: string,
  website: string,
  date: string,
  videos: string[],
}

type MappedConference = {
  id: string,
  conference: MapperConferenceInner
}

type UnmappedConference = {
    website: string,
    date: string,
    videos: string,
    title: string,
  }

  type ProcessedResultType = Array<{
    id: string,
    website: string
    date: string,
    title: string,
    videos: VideoType[]
}>

type RedisResponseData = [number, ...Array<string | string[]>]

const toObject = <T>(data: string[]): T => {
  return data.reduce((acc, key, index) => {
    if(index%2 === 0){
      let value: string | string[] = data[index+1] 
      if(key === 'videos'){
        value = data[index+1].split(' ||| ')
      }
      acc = {
        ...acc,
        [key]: value
      }
    }
    return acc;
  }, {} as T)
}

const conferencesToObject = (data: RedisResponseData) => {
  data.splice(0,1);
  return data.reduce((acc, key, index) => {
    if(index%2 === 0){
      acc = [
        ...acc,
        {
          id: key as string, 
          conference: toObject<MapperConferenceInner>(data[index+1] as string[])
        }
      ]
    }
    return acc;
  }, [] as MappedConference[])
}

const videosToObject = (data: RedisResponseData): MappedVideo[] => {
  data.splice(0,1);
  return data.reduce((acc, key, index) => {
    if (index % 2 === 0) {
      acc = [
        ...acc,
        {
          id: key as string, 
          video: toObject<VideoType>(data[index+1] as string[])
        }
      ]
    }
    return acc;
  }, [] as MappedVideo[])
}

const getConference = async (event: Event) => {
  const conference = event.queryStringParameters?.conference
  const query = `@title:${conference}`

  try{
    const conferenceResults: RedisResponseData = await redis.send_command('FT.SEARCH', `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}conference`, query)
    
    if(!conferenceResults || conferenceResults[0] !== 1 || typeof conferenceResults[1] !== "string"){
      throw new Error('Conference not found')
    }

    // return conference id
    const conferences = conferencesToObject(conferenceResults)
    return conferences[0]
  }catch(error){
    console.error(error)
    console.error('QUERY::', query)
    error.statusCode = 404
    throw error;
  }

}

const searchConferences = async (event: Event) => {
  const query = event.queryStringParameters?.query ?? '';
  try{
    const conferenceResults = await redis.send_command('FT.SEARCH', `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}conference`, query, "HIGHLIGHT", ...'TAGS <b><i> </i></b>'.split(' '))
    if (!conferenceResults) { return null; }

    const conferencesAsObjects = conferencesToObject(conferenceResults)

    // and get all videos for conferences that matched...
    const queries: string[]= []
    const pipeline = redis.pipeline();
    for(const conference of conferencesAsObjects){
      for(const videoId of conference.conference.videos){
        queries.push(`${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`)
        pipeline.hgetall(`${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`)
      }
    } 

    const results = await pipeline.exec() as Array<[Error, VideoType]>
    const newResults = results.map(([_, result]: [Error, VideoType], index: number) => {
      return {
          ...result,
          id: queries[index],
      }
    })


    const processedResults: ProcessedResultType = [];
    for(const conference of conferencesAsObjects){
      const newConference = {
          ...conference.conference,
          id : conference.id,
          videos: conference.conference.videos
            .filter((videoId: string) => newResults.find((video: VideoType) => video.id === `${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`))
            .map((videoId: string) => {
              const video = newResults.find((video: VideoType) => video.id === `${REDIS_PREFIX}${DELIMITER}video${DELIMITER}${videoId}`);
              return video as VideoType;
            })
            
        }
      processedResults.push(newConference)
    }
    return processedResults
  }catch(error){
    console.error(error)
    console.error('QUERY::', query)
    throw error;
  }
}

// high limit based on 
const searchVideos = async (event: Event, conference?: MappedConference) => {
  const query = event.queryStringParameters?.query ?? '';
  const AND = query && !!conference ? ' & ' : '';
  const redisSearch = `${!!query ? `(@title|presenter:(${query}))` : ''} ${AND} ${!!conference?.id ? `@conferenceId:${conference.id}` : ''}`;

  try{
    const videoResults = await redis.send_command('FT.SEARCH', `${REDIS_PREFIX}${DELIMITER}idx${DELIMITER}video`, redisSearch, 'HIGHLIGHT', ...'FIELDS 2 title presenter'.split(' '), ...'TAGS <i> </i>'.split(' '), ...'LIMIT 0 10000'. split(' '));

    if(!videoResults) { return null; }

    const videosAsObjects = videosToObject(videoResults)

    const conferenceIds = new Set(videosAsObjects.map(video => video.video.conferenceId))

    // now get conferences for these videos, replacing their videos object with the callee
    const queries: string[] = []
    const pipeline = redis.pipeline();
    for (const conferenceId of Array.from(conferenceIds)) {
      queries.push(conferenceId)
      pipeline.hgetall(conferenceId)
    } 

    const results = await pipeline.exec() as Array<[Error | null, UnmappedConference]>
    const newResults = results.map(([_, result], index: number) => {
      return {
        id: queries[index],
        conference: result
      }
    })

    const conferenceMap = new Map()
    const newNewResults: ProcessedResultType = []
    for(const conference of newResults){
      const newConference = {
          ...conference.conference,
          id: conference.id, 
          videos: []
        }
      newNewResults.push(newConference)
      conferenceMap.set(conference.id, newConference)
    }

    for(const video of videosAsObjects){
      const conference = conferenceMap.get(video.video.conferenceId)
      conference.videos.push({
        id: video.id,
        ...video.video
      })
    }

    return newNewResults
  }catch(error){
    console.error(error)
    console.error('QUERY::', redisSearch)
    throw error;
  }
}

const mergeResults = (conferenceResults: ProcessedResultType, videoResults: ProcessedResultType) => {
  const results = [...conferenceResults]

  // go through conferences, and see if there is a matching result in the videoResults.
  // if so, replace conferenceResults video with one in videoResults
  for(const conf of results){
    const matchingConference = videoResults.find(conference => conference.id === conf.id)
    // if there is a matching conference, replace matching videos...
    if(matchingConference){
      for(const video of matchingConference.videos){
        // replace matching video from conferenceResults with one in videoResults        
        const index = conf.videos.findIndex(vid => vid.id === video.id)
        if(index > -1){
          conf.videos[index] = video
        }
      }
    }
  }

  // finally merge in any remaning videos from conferences not in conferenceResults...
  for(const conf of videoResults){
    const found = results.findIndex(conference => conf.id === conference.id)
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

  if (event.queryStringParameters?.query === undefined && event.queryStringParameters?.conference === undefined){
    return { statusCode: 400, body: 'Invalid Request' };
  }

  if(event.queryStringParameters?.conference !== undefined && event.queryStringParameters?.query === undefined){
    event.queryStringParameters.query = ''
  }

  try {
    let conference: MappedConference | undefined;
    let conferenceResults: ProcessedResultType | null | undefined;
    if (!!event.queryStringParameters?.conference) {
      conference = await getConference(event)
    } else {
      conferenceResults = await searchConferences(event)
    } 

    const videoResults = await searchVideos(event, conference)

    const results = !!conferenceResults && !!videoResults ? mergeResults(conferenceResults, videoResults) : conferenceResults || videoResults

    return {
      statusCode: 200,
      body: JSON.stringify(results, null, 2)
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: e.statusCode || 500,
      body: e.toString()
    };
  }
};

export { handler };
