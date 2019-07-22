import { push } from 'connected-react-router';
import * as queryString from 'query-string';
import * as ReactGA from 'react-ga';
import { combineEpics, Epic } from 'redux-observable';
import { concat, of } from 'rxjs';
import {
  debounceTime,
  ignoreElements,
  map,
  mergeMap,
  tap
} from 'rxjs/operators';

import { ApplicationState } from 'redux/modules';
import { sluggifyUrl } from 'utils';
import { isFilterEmpty } from 'utils';
import { IndexedConferences } from '../../domain';
import { conferencePageActions } from './conferencePage';
import { COPY_DATA } from './data';
import { searchActions } from './search';

export const NAVIGATE_TO_SEARCH_URL = 'routing/NAVIGATE_TO_SEARCH_URL';
export const navigateToSearchURL = (payload: string) => ({
  type: NAVIGATE_TO_SEARCH_URL,
  payload
});

export const isSearchPage = (pathname: string) =>
  pathname === '/' || pathname.includes('/search');

// extract query value from search
export const extractQueryFromSearch = (search: string) => {
  const parsed = queryString.parse(search);
  const query = parsed.query ? parsed.query : '';
  return query as string;
};

const getConferenceNameFromPathname = (pathname: string) => {
  const match = pathname.match(/conference\/(?:.*?\/)?(.{4,}?)$/);
  const title = match && match[1] ? match[1] : '';
  return title;
};

const searchConferencesGivenUrlTitle = (
  title: string,
  conferences: IndexedConferences
) => {
  const matchedConferences = Object.keys(conferences).filter(
    confKey => sluggifyUrl(conferences[confKey].title) === title
  );
  return matchedConferences[0];
};

// load data in right place on initial page load
export const loadDataForRoute: Epic<any, any, ApplicationState> = (
  action$,
  store
) =>
  action$.ofType(COPY_DATA, '@@router/LOCATION_CHANGE').pipe(
    mergeMap(() => {
      const location = store.value.router.location;
      const { search, pathname } = location;
      if (isSearchPage(pathname)) {
        return of(searchActions.filter(extractQueryFromSearch(search)));
      } else {
        const title = getConferenceNameFromPathname(pathname);
        const id = searchConferencesGivenUrlTitle(
          title,
          store.value.data.conferences
        );
        return concat([
          conferencePageActions.setConferenceDetails(id),
          searchActions.filter(extractQueryFromSearch(search))
        ]);
      }
    })
  );

export const trackingForRoute: Epic<any, any, ApplicationState> = (
  action$,
  store
) =>
  action$.ofType('@@router/LOCATION_CHANGE').pipe(
    debounceTime(300),
    tap(_ => {
      if (window.location.hostname !== 'www.reactjsvideos.com') {
        return;
      }
      const { pathname, search } = store.value.router.location;
      const page = `${pathname}${search}`;
      ReactGA.set({ page });
      ReactGA.pageview(page);
    }),
    ignoreElements()
  );

// action to navigate to a url with a query string
export const navigateToSearchResult: Epic<any, any, ApplicationState> = (
  action$,
  store
) =>
  action$.ofType(NAVIGATE_TO_SEARCH_URL).pipe(
    map(action => {
      // next location is based on current one
      const { location } = store.value.router;
      const filter = action.payload;
      const query = !isFilterEmpty(filter) ? `?query=${action.payload}` : '';
      const nextUrl = `${location.pathname}${query}`;
      return push(nextUrl);
    })
  );

export const routingActions = {
  navigateToSearchURL
};

export const routingEpics = combineEpics(
  navigateToSearchResult,
  loadDataForRoute,
  trackingForRoute
);
