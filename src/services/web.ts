import axios from 'axios';
import * as queryString from 'query-string';
import { Conferences } from '../domain/TransformedJSON';

type GetListProps = {
  start?: number;
  end?: number;
};

export const getList = async (
  props: GetListProps = {}
): Promise<Conferences> => {
  const newParams = { ...props };
  if (!newParams.start) {
    newParams.start = 0;
  }
  if (!newParams.end) {
    newParams.end = newParams.start + 19;
  }
  const queryStrings = queryString.stringify(props);
  const url = `/.netlify/functions/list?${queryStrings}`;
  const result = await axios.get(url);

  return result.data;
};

type SearchProps = {
  query?: string;
  conference?: string;
};

export const search = async (props: SearchProps = {}): Promise<Conferences> => {
  const queryStrings = queryString.stringify(props);
  const url = `/.netlify/functions/search?${queryStrings}`;
  const result = await axios.get(url);

  return result.data;
};
