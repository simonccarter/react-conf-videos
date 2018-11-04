import { Observable } from 'rxjs';
import * as queryString from 'query-string'
import { Epic, combineEpics } from 'redux-observable'

import { LOAD_DATA_END } from './data'
import { searchActions } from './search'
import { conferencePageActions } from './conferencePage'

const isSearchPage = (pathname: string) => pathname === "/" || pathname.includes('/search')

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
  return <string>id
}

// load data in right place on initial page load
export const loadDataForRoute: Epic<any, any> = (action$, store) => 
  action$.ofType(LOAD_DATA_END)
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

export const locationEpics = combineEpics(loadDataForRoute)
