import { logger } from './logger';
import {
  RedisResponseData,
  MappedConferenceWithoutVideos,
  MappedConferenceInner,
  MappedVideo,
  VideoType,
} from './models';

export const toObject = <T>(data: string[]): T => {
  return data.reduce((acc, key, index) => {
    if (index % 2 === 0) {
      let value: string | string[] = data[index + 1];
      if (key === 'videos') {
        value = data[index + 1].split(' ||| ');
      }

      return {
        ...acc,
        [key]: value,
      };
    }

    return acc;
  }, {} as T);
};

export const conferencesToObject = (data: RedisResponseData) => {
  data.splice(0, 1);

  return data.reduce<MappedConferenceWithoutVideos[]>((acc, key, index) => {
    if (index % 2 === 0) {
      return [
        ...acc,
        {
          id: key as string,
          conference: toObject<MappedConferenceInner>(
            data[index + 1] as string[]
          ),
        },
      ];
    }

    return acc;
  }, []);
};

export const videosToObject = (data: RedisResponseData): MappedVideo[] => {
  data.splice(0, 1);

  return data.reduce((acc, key, index) => {
    if (index % 2 === 0) {
      return [
        ...acc,
        {
          id: key as string,
          video: toObject<VideoType>(data[index + 1] as string[]),
        },
      ];
    }

    return acc;
  }, [] as MappedVideo[]);
};
