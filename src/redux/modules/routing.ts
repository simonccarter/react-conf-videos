// sets required data for specific pages on page load

import * as queryString from 'query-string'
import { Epic, combineEpics } from 'redux-observable'
import { LOAD_DATA_END } from './data'

import { frontPageActions } from './frontPage'
import { conferencePageActions } from './conferencePage'

// handles front page also
const isSearchPage = (pathname: string) => pathname === "/" || pathname.includes('/search')
const isConferencePage = (pathname: string) => pathname.includes('/conference')

const extractSearchPagePath = (search: string) => {
  const parsed = queryString.parse(search)

  // even if no query is present, still send, as it's the front page,
  // so requires all data to be loaded
  const query = parsed.query ? parsed.query : 
            parsed['?query'] ? parsed['?query'] : ''
  return query
}

const getConferenceIdFromTitleFromPathname = (pathname: string, store: any) => {
  const match = pathname.match(/conference\/(.*?)\//)
  const id = match && match[1]
  return id
}

// load data in right place on initial page load
export const loadDataForRoute: Epic<any, any> = (action$, store) => 
  action$.ofType(LOAD_DATA_END)
    .map(() => {
      const location = store.getState().router.location;
      const { search, pathname } = location
      if(isSearchPage(pathname)){
        return frontPageActions.filter(extractSearchPagePath(search))
      } 
      else if (isConferencePage(pathname)){
        const id = getConferenceIdFromTitleFromPathname(pathname, store)
        return id ? conferencePageActions.setConferenceDetails(id) : null
      }
    })

export const locationEpics = combineEpics(loadDataForRoute)
