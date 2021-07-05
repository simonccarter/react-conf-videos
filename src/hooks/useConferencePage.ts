import * as React from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { computedResultDetails, listState, queryState } from '../state'
import { sluggifyUrl } from '../utils'
import { useDebounce } from './useDebounce'

import * as queryString from 'query-string';

const useSearch = (routeMatch?: string) => {
    const history = useHistory();
    const location = useLocation()
    
    const [query, setQuery] = useRecoilState(queryState)
    const [localQuery, setLocalQuery] = React.useState(query)
    const debouncedQuery = useDebounce(localQuery)

    const list = useRecoilValue(listState);

    const match = useRouteMatch<{ name?: string }>(routeMatch ?? '')

    // const list = useRecoilValue(filteredListState(match?.params?.name ?? ''));
    // const filteredList = useRecoilValue(filteredListState(match?.params?.name ?? ''));
    
    const { numberOfVideos, numberOfConferences } = useRecoilValue(computedResultDetails)
    // const [conference, setConference] = React.useState<ConferenceTransformed | undefined>(filteredList?.[0])

    // debounce
    React.useEffect(() => {
        if (debouncedQuery || debouncedQuery === '') {
            setQuery(debouncedQuery)
        }
    }, [debouncedQuery]);

    // set conference details for conference/:name pages
    // React.useEffect(() => {
    //     if (filteredList.length) {
    //         setConference(filteredList[0])
    //     }
    // }, [filteredList])

    // set query state on load based off of url
    React.useEffect(() => {
        const search = queryString.parse(location.search)
        if (search?.query && search.query !== '') {
            setLocalQuery(search.query as string) // :/
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
        // conference,
        list,
        onInputChange,
        numberOfVideos,
        numberOfConferences
    }
}

export default useSearch