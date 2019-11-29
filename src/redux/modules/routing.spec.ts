import { ActionsObservable } from 'redux-observable';
import { take, toArray } from 'rxjs/operators';

import { mockDataState, mockRouterState, mockStore } from 'utils/test';

import { conferencePageActions } from './conferencePage';
import { COPY_DATA } from './data';
import {
  extractQueryFromSearch,
  loadDataForRoute,
  NAVIGATE_TO_SEARCH_URL,
  navigateToSearchResult
} from './routing';
import { searchActions } from './search';

describe('routing', () => {
  describe('navigateToSearchResult', () => {
    it('should return the correct action', done => {
      // arrange
      const payload = 'fake filter';
      const action$ = ActionsObservable.of({
        type: NAVIGATE_TO_SEARCH_URL,
        payload
      });
      const expectedResult = {
        type: '@@router/CALL_HISTORY_METHOD',
        payload: {
          method: 'push',
          args: [
            '/conference/8424e37df85b9eccbe48e9a55d93845e/react-conf-2018?query=fake%20filter'
          ]
        }
      };

      // act
      navigateToSearchResult(
        action$,
        mockStore(mockRouterState()),
        null
      ).subscribe(action => {
        // assert
        expect(action).toEqual(expectedResult);
        done();
      });
    });

    it('should return the correct action with no filter', done => {
      // arrange
      const payload = '';
      const action$ = ActionsObservable.of({
        type: NAVIGATE_TO_SEARCH_URL,
        payload
      });
      const expectedResult = {
        type: '@@router/CALL_HISTORY_METHOD',
        payload: {
          method: 'push',
          args: ['/conference/8424e37df85b9eccbe48e9a55d93845e/react-conf-2018']
        }
      };

      // act
      navigateToSearchResult(
        action$,
        mockStore(mockRouterState()),
        null
      ).subscribe(action => {
        // assert
        expect(action).toEqual(expectedResult);
        done();
      });
    });
  });

  describe('loadDataForRoute', () => {
    describe('search page locations', () => {
      it('should handle no query in url', done => {
        // arrange
        const action$ = ActionsObservable.of({ type: COPY_DATA });
        const state = mockRouterState();
        state.router.location.pathname = '/search';
        const expectedResult = searchActions.filter('');

        // act
        loadDataForRoute(action$, mockStore(state), null).subscribe(action => {
          // assert
          expect(action).toEqual(expectedResult);
          done();
        });
      });

      it('should handle query in url', done => {
        // arrange
        const action$ = ActionsObservable.of({ type: COPY_DATA });
        const state = mockRouterState();
        const filter = 'filter';
        state.router.location.pathname = '/search';
        state.router.location.search = `?query=${filter}`;
        const expectedResult = searchActions.filter(filter);

        // act
        loadDataForRoute(action$, mockStore(state), null).subscribe(action => {
          // assert
          expect(action).toEqual(expectedResult);
          done();
        });
      });
    });

    describe('conference page locations', () => {
      it('should return the correct action', done => {
        // arrange
        const action$ = ActionsObservable.of({ type: COPY_DATA });
        const state = Object.assign(
          {},
          mockRouterState('/conference/react-conf-2018'),
          mockDataState()
        );
        const filter = 'filter';
        state.router.location.search = `?query=${filter}`;
        const expectedResult1 = conferencePageActions.setConferenceDetails(
          'XXXX'
        );
        const expectedResult2 = searchActions.filter(filter);

        // act
        loadDataForRoute(action$, mockStore(state), null)
          .pipe(
            take(2),
            toArray()
          )
          .subscribe(([action1, action2]) => {
            // assert
            expect(action1).toEqual(expectedResult1);
            expect(action2).toEqual(expectedResult2);
            done();
          });
      });
    });
  });

  describe('extractQueryFromSearch', () => {
    it('should return empty string if no query present', () => {
      // arrange
      const search = '';

      // act
      const result = extractQueryFromSearch(search);

      // assert
      expect(result).toEqual('');
    });

    it('should return filter value when present', () => {
      // arrange
      const search = 'query=filterValue';

      // act
      const result = extractQueryFromSearch(search);

      // assert
      expect(result).toEqual('filterValue');
    });
  });
});
