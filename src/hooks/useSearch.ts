import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { computedResultDetails, listState, queryState } from '../state'
import { sluggifyUrl } from '../utils'
import { useDebounce } from './useDebounce'

import * as queryString from 'query-string';
import { getList, search } from '../services/web'

const useSearch = (routeMatch?: string) => {
    const history = useHistory();
    const location = useLocation()
    
    const [query, setQuery] = useRecoilState(queryState)
    const [localQuery, setLocalQuery] = React.useState(query)
    const debouncedQuery = useDebounce(localQuery)
    const [list, setList] = useRecoilState(listState);

    const { numberOfVideos, numberOfConferences } = useRecoilValue(computedResultDetails)

    // debounce
    React.useEffect(() => {
        if (debouncedQuery || debouncedQuery === '') {
            setQuery(debouncedQuery)
        }
    }, [debouncedQuery]);

    // set query state on load based off of url
    React.useEffect(() => {
        const search = queryString.parse(location.search);
        if (search?.query && search.query !== '') {
            setLocalQuery(search.query as string) // :/
        }
    }, [])

    // set url based off query state 
    React.useEffect(() => {
        const url = query === '' ? location.pathname : `${location.pathname}?query=${sluggifyUrl(query)}`
        history.push(encodeURI(url));
    }, [query])

    // update list based on search
    React.useEffect(() => {
            const getVideos = async () => {
                if(!!query){
                    const result = await search({query})
                    setList(result)
                }else{
                    const data = await getList({start: 0})
                    setList(data);
                }
            }
            getVideos()
    }, [query])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalQuery(e.target.value)
    };

    return {
        query,
        localQuery,
        list,
        onInputChange,
        numberOfVideos,
        numberOfConferences
    }
}

export default useSearch