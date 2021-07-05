import axios from 'axios';
import * as queryString from 'query-string';
import { Conferences } from '../domain/TransformedJSON';

type GetListProps = {
    start?: number,
    end?: number,
}

export const getList = async (props: GetListProps = {}): Promise<Conferences> => {
    if(!props.start) { props.start = 0; }
    if(!props.end) { props.end = 19; } 
    const queryStrings = queryString.stringify(props)
    const url = `/.netlify/functions/list?${queryStrings}`
    try {
        const result = await axios.get(url)
        return result.data
    } catch (error){
        return error;
    }
}