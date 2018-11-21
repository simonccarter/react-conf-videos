import 'rxjs'
import * as Immutable from 'seamless-immutable'
import { ActionsObservable } from 'redux-observable'

import {
  mockStore, mockDataState,
  mockConferencePageSlice, mockRouterState, mockIndexedConferences
} from 'utils'

import searchReducer, {
  textInDetails, initialState,
  FILTER, SET_FILTERED_CONFERENCES,
  SET_IS_ACTIVE, filterEpic, createConference
} from './search'

describe('search', () => {
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

      const conferences = Immutable<any>({ idx: { videos } })
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
      jest.setTimeout(10000)
      // arrange
      const payload = ''
      const action$ = ActionsObservable.of({ type: FILTER, payload })
      const expectedPayload = mockIndexedConferences()

      const store = {
        ...mockDataState(),
        ...mockRouterState(),
        ...mockConferencePageSlice(),
      }

      // act
      filterEpic(action$, mockStore(store), null)
        .subscribe(
          (action) => {
            // assert
            expect(action.type).toEqual(SET_FILTERED_CONFERENCES)
            expect(action.payload).toEqual(expectedPayload)
            done()
          }
        )

    })

  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      // act
      const result = searchReducer(undefined, { type: 'EEE' })

      // assert
      expect(result).toEqual(initialState)
    })

    it('should set the filter value', () => {
      // arrange
      const payload = 'filter value'
      const action = { type: FILTER, payload }

      // act
      const result = searchReducer(undefined, action)

      // assert
      expect(result.filterValue).toEqual(payload)
    })

    it('should set the filtered conferences', () => {
      // arrange
      const payload = { idx: 'filtered conferences' }
      const action = { type: SET_FILTERED_CONFERENCES, payload }

      // act
      const result = searchReducer(undefined, action)

      // assert
      expect(result.conferences).toEqual(payload)
    })

    it('should set the isActive status', () => {
      // arrange
      const payload = false
      const action = { type: SET_IS_ACTIVE, payload }

      // act
      const result = searchReducer(undefined, action)

      // assert
      expect(result.isActive).toBe(false)
    })

  })

})
