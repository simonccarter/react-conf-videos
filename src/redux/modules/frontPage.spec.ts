import 'rxjs'
import * as Immutable from 'seamless-immutable'
import { ActionsObservable } from 'redux-observable'

import { onError, mockStore } from '../../utils'

import frontPageReducer, {
  textInDetails, initialState,
  INIT_SLICE, FILTER, SET_FILTERED_CONFERENCES,
  SET_IS_ACTIVE, filterEpic, createConference,
  routingEpic
} from './frontPage'

describe('frontPage', () => {
  describe('textInDetails', () => {
    let phrasesToSearchIn: [string, string] = ['', '']
    let query = ''
    beforeEach((() => {
      phrasesToSearchIn = ['aaa', 'aaab']
      query = 'b'
    }))

    it('should return true', () => {
      // arrange 
      // act
      const result = textInDetails(query, phrasesToSearchIn)

      // assert
      expect(result).toEqual(true)
    })

    it('should return false', () => {
      // arrange 
      query = 'x'

      // act
      const result = textInDetails(query, phrasesToSearchIn)

      // assert
      expect(result).toEqual(false)
    })
  })

  describe('filterVideos', () => { })

  describe('createConference', () => {
    it('should return empty object given empty array of matched videos', () => {
      // arrange
      const conferences = Immutable<any>({})

      // act
      const result = createConference(conferences, 'x', {}, [])

      // assert
      expect(result).toEqual({})
    })

    it('should add array of match video ids to conference', () => {
      // arrange
      const videos = Object.freeze(['aaa', 'bbb'])
      const mVideos = ['ccc', 'ddd']
      const confIdx = 'idx'

      const conferences = Immutable<any>({ 'idx': { videos } })
      const newConferences = {}
      const expectedResult = conferences.setIn([confIdx], { videos: [...mVideos] })

      // act
      const result = createConference(conferences, 'idx', newConferences, mVideos)

      // assert
      expect(result).toEqual(expectedResult)
    })
  })

  describe('filterEpic', () => {
    it('should return the correct action', (done) => {
      // arrange
      const payload = { conferences: {} }
      const action$ = ActionsObservable.of({ type: FILTER, payload })
      const expectedPayload = { conferences: {} }
      // act
      filterEpic(action$, mockStore(), null)
        .subscribe(
          action => {
            // assert
            expect(action.type).toEqual(INIT_SLICE)
            expect(action.payload).toEqual(expectedPayload)
            done()
          },
          onError(done)
        )
    })
  })

  describe('routingEpic', () => {
    it('should call return the correct action when a query string is present', (done) => {
      // arrange
      const payload = 'keynote'
      const action$ = ActionsObservable.of({ type: FILTER, payload })

      // CALL_HISTORY_METHOD is dispatched by connected-react-router,
      // though this is not displayed in redux dev tools. The below action
      // won't match what you see in your redux dev logger.
      const expectedAction = {
        "payload": {
          "args": [`/search?query=${payload}`],
          "method": "push"
        }, 
        "type": "@@router/CALL_HISTORY_METHOD"
      }

      // act
      routingEpic(action$, mockStore(), null)
        .subscribe(
          action => {
            // assert 
            expect(action).toEqual(expectedAction)
            done()
          },
          onError(done)
        )
    })

    it('should call return the correct action when the query string is empty', (done) => {
      // arrange
      const payload = ''
      const action$ = ActionsObservable.of({ type: FILTER, payload })

      // CALL_HISTORY_METHOD is dispatched by connected-react-router,
      // though this is not displayed in redux dev tools. The below action
      // won't match what you see in your redux dev logger.
      const expectedAction = {
        "payload": {
          "args": ['/'],
          "method": "push"
        }, 
        "type": "@@router/CALL_HISTORY_METHOD"
      }

      // act
      routingEpic(action$, mockStore(), null)
        .subscribe(
          action => {
            // assert 
            expect(action).toEqual(expectedAction)
            done()
          },
          onError(done)
        )
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      // act
      const result = frontPageReducer(undefined, { type: 'EEE' })
      // assert
      expect(result).toEqual(initialState)
    })

    it('should initiate the slice with the payload', () => {
      // arrange 
      const payload = { 'conferences': { 'idx': { 'title': 'lalala' } } }
      const expectedResult = initialState.merge(payload)
      const action = { type: INIT_SLICE, payload }

      // act
      const result = frontPageReducer(undefined, action)

      // assert
      expect(result).toEqual(expectedResult)
    })

    it('should set the filter value', () => {
      // arrange 
      const payload = 'filter value'
      const action = { type: FILTER, payload }

      // act
      const result = frontPageReducer(undefined, action)

      // assert
      expect(result.filterValue).toEqual(payload)
    })

    it('should set the filtered conferences', () => {
      // arrange 
      const payload = { 'idx': 'filtered conferences' }
      const action = { type: SET_FILTERED_CONFERENCES, payload }

      // act
      const result = frontPageReducer(undefined, action)

      // assert
      expect(result.conferences).toEqual(payload)
    })

    it('should set the isActive status', () => {
      // arrange 
      const payload = false
      const action = { type: SET_IS_ACTIVE, payload }

      // act
      const result = frontPageReducer(undefined, action)

      // assert
      expect(result.isActive).toBe(false)
    })



  })

})