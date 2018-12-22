
import * as queryString from 'query-string'
import { of, concat } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { push } from 'connected-react-router'
import { Epic, combineEpics } from 'redux-observable'

import { isFilterEmpty } from 'utils'
import { LOAD_DATA_END } from './data'
import { searchActions } from './search'
import { ApplicationState } from 'redux/modules'
import { conferencePageActions } from './conferencePage'

export const NAVIGATE_TO_SEARCH_URL = 'routing/NAVIGATE_TO_SEARCH_URL'
export const navigateToSearchURL = (payload: string) => ({type: NAVIGATE_TO_SEARCH_URL, payload})

export const isSearchPage = (pathname: string) => pathname === '/' || pathname.includes('/search')

// extract query value from search
export const extractQueryFromSearch = (search: string) => {
  const parsed = queryString.parse(search)
  const query = parsed.query ? parsed.query : ''
  return query
}

const getConferenceIdFromTitleFromPathname = (pathname: string) => {
  const match = pathname.match(/conference\/(.*?)\//)
  const id = match && match[1]
  return id as string
}

// load data in right place on initial page load
export const loadDataForRoute: Epic<any, any, ApplicationState> = (action$, store) =>
  action$.ofType(LOAD_DATA_END, '@@router/LOCATION_CHANGE')
    .pipe(
      mergeMap(() => {
        const location = store.value.router.location;
        const { search, pathname } = location
        if (isSearchPage(pathname)) {
          return of(searchActions.filter(extractQueryFromSearch(search)))
        } else {
          const id = getConferenceIdFromTitleFromPathname(pathname)
          return concat([
            conferencePageActions.setConferenceDetails(id),
            searchActions.filter(extractQueryFromSearch(search))
          ])
        }
      })
    )

// action to navigate to a url with a query string
export const navigateToSearchResult: Epic<any, any, ApplicationState> = (action$, store) =>
  action$.ofType(NAVIGATE_TO_SEARCH_URL).pipe(
    map((action) => {
      // next location is based on current one
      const { location } = store.value.router
      const filter = action.payload;
      const query = !isFilterEmpty(filter) ? `?query=${action.payload}` : ''
      const nextUrl = `${location.pathname}${query}`
      return push(nextUrl)
    }))

export const routingActions = {
  navigateToSearchURL
}

export const routingEpics = combineEpics(
  navigateToSearchResult,
  loadDataForRoute
)
