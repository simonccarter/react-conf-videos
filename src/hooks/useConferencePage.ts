import * as React from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { computedResultDetails, listState, queryState } from '../state'
import { sluggifyUrl } from '../utils'
import { useDebounce } from './useDebounce'

import * as queryString from 'query-string';
import { search } from 'services/web'
import { ConferenceTransformed } from '../domain/TransformedJSON'

const useConference = (routeMatch?: string) => {
    const history = useHistory();
    const location = useLocation()
    
    const [query, setQuery] = useRecoilState(queryState)
    const [localQuery, setLocalQuery] = React.useState(query)
    const debouncedQuery = useDebounce(localQuery)

    const [list, setList] = useRecoilState(listState);

    const match = useRouteMatch<{ name?: string }>(routeMatch ?? '')

    // const list = useRecoilValue(filteredListState(match?.params?.name ?? ''));
    // const filteredList = useRecoilValue(filteredListState(match?.params?.name ?? ''));
    
    const { numberOfVideos, numberOfConferences } = useRecoilValue(computedResultDetails)
    const [conference, setConference] = React.useState<ConferenceTransformed | undefined>(list?.[0])

    // search over conference based off conference name
    React.useEffect(() => {
        const getVideos = async () => {
            if(match?.params?.name){
                const result = await search({
                    conference: match.params.name,
                    query
                })
                setList(result)
            }
        }
        getVideos()
    }, [match?.params?.name, query])

    // debounce
    React.useEffect(() => {
        if (debouncedQuery || debouncedQuery === '') {
            setQuery(debouncedQuery)
        }
    }, [debouncedQuery]);

    // set conference details for conference/:name pages
    React.useEffect(() => {
        if (list.length) {
            setConference(list[0])
        }
    }, [list?.[0]?.title])

    // set query state on load based off of url
    React.useEffect(() => {
        const search = queryString.parse(location.search)
        if (search?.query && search.query !== '') {
            setLocalQuery(search.query as string) 
        }
    }, [])

    // set url based off query state 
    React.useEffect(() => {
        const url = query === '' ? location.pathname : `${location.pathname}?query=${sluggifyUrl(query)}`
        history.push(encodeURI(url));
    }, [query])


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalQuery(e.target.value)
    };

    return {
        query,
        localQuery,
        conference,
        list,
        onInputChange,
        numberOfVideos,
        numberOfConferences
    }
}

export default useConference