import { Observable } from 'rxjs';
import * as queryString from 'query-string'
import { push } from 'connected-react-router'
import { Epic, combineEpics } from 'redux-observable'

import { isFilterEmpty } from 'utils'
import { LOAD_DATA_END } from './data'
import { searchActions } from './search'
import { conferencePageActions } from './conferencePage'

export const NAVIGATE_TO_SEARCH_URL = 'routing/NAVIGATE_TO_SEARCH_URL'
export const navigateToSearchURL = (payload: string) => ({type: NAVIGATE_TO_SEARCH_URL, payload})

const isSearchPage = (pathname: string) => pathname === "/" || pathname.includes('/search')

// extract query from url
const extractSearchPagePath = (search: string) => {
  const parsed = queryString.parse(search)
  const query = parsed.query ? parsed.query : 
            parsed['?query'] ? parsed['?query'] : ''
  return query
}

const getConferenceIdFromTitleFromPathname = (pathname: string, store: any) => {
  const match = pathname.match(/conference\/(.*?)\//)
  const id = match && match[1]
  return <string>id
}

// load data in right place on initial page load
export const loadDataForRoute: Epic<any, any> = (action$, store) => 
  action$.ofType(LOAD_DATA_END, '@@router/LOCATION_CHANGE')
    .mergeMap(() => {
      const location = store.getState().router.location;
      const { search, pathname } = location
      if(isSearchPage(pathname)){
        return Observable.of(searchActions.filter(extractSearchPagePath(search)))
      } else {
        const id = getConferenceIdFromTitleFromPathname(pathname, store)
        return Observable.concat([
          conferencePageActions.setConferenceDetails(id),
          searchActions.filter(extractSearchPagePath(search))
        ])
      }
    })

// action to navigate to a url with a query string
export const navigateToSearchResult: Epic<any, any> = (action$, store) => 
  action$.ofType(NAVIGATE_TO_SEARCH_URL)
    .map(action => {
      // next location is based on current one
      const location = store.getState().router.location
      const filter = action.payload;
      const query = !isFilterEmpty(filter) ? `?query=${action.payload}` : ''
      const nextUrl = `${location.pathname}${query}`
      return push(nextUrl)
    })

export const routingActions = {
  navigateToSearchURL
}

export const locationEpics = combineEpics(
  navigateToSearchResult,
  loadDataForRoute
)
