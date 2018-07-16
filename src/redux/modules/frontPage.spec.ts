import 'rxjs'
import * as Immutable from 'seamless-immutable'
import { ActionsObservable } from 'redux-observable'

import { COPY_DATA } from './data'
import { onError, mockStore } from '../../utils'

import frontPageReducer, { 
  textInDetails, initSliceEpic, initialState,
  INIT_SLICE, FILTER, SET_FILTERED_CONFERENCES, 
  SET_IS_ACTIVE, filterEpic, createConference
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

  describe('filterVideos', () => {})

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
      
      const conferences = Immutable<any>({'idx': {videos}})
      const newConferences = {}
      const expectedResult = conferences.setIn([confIdx], {videos: [...mVideos]})
      
      // act
      const result = createConference(conferences, 'idx', newConferences, mVideos)

      // assert
      expect(result).toEqual(expectedResult)
    })
  })

  describe('initSliceEpic' , () => {
    it('should return the correct action', (done) => {
      // arrange
      const payload = { conferences: {} }
      const action$ = ActionsObservable.of({type: COPY_DATA, payload})
      const expectedPayload = { conferences: {}, filteredConferences: {} }

      // act
      initSliceEpic(action$, mockStore(), null)
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

  describe('filterEpic', () => {
    it('should return the correct action', (done) => {
      // arrange
      const payload = { conferences: {} }
      const action$ = ActionsObservable.of({type: FILTER, payload})
      const expectedPayload = {conferences: {}}
      // act
      filterEpic(action$, mockStore(), null)
        .subscribe(
          action => {
            expect(action.type).toEqual(INIT_SLICE)
            expect(action.payload).toEqual(expectedPayload)
            done()
          },
          onError(done)
        )
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      // arrange
      // act
      const result = frontPageReducer(initialState, {type: 'EEE'})
      // assert
      expect(result).toEqual(result)
    })

    it('should initiate the slice with the payload', () => {
      // arrange 
      const payload = {'conferences': {'idx': {'title': 'lalala'}}}
      const expectedResult = initialState.merge(payload)
      const action = { type: INIT_SLICE, payload }
      
      // act
      const result = frontPageReducer(initialState, action)

      // assert
      expect(result).toEqual(expectedResult)
    })

    it('should set the filter value', () => {
      // arrange 
      const payload = 'filter value'
      const action = { type: FILTER, payload }
      
      // act
      const result = frontPageReducer(initialState, action)

      // assert
      expect(result.filterValue).toEqual(payload)
    })

    it('should set the filtered conferences', () => {
      // arrange 
      const payload = {'idx': 'filtered conferences'}
      const action = { type: SET_FILTERED_CONFERENCES, payload }
      
      // act
      const result = frontPageReducer(initialState, action)

      // assert
      expect(result.filteredConferences).toEqual(payload)
    })

    it('should set the isActive status', () => {
      // arrange 
      const payload = false
      const action = { type: SET_IS_ACTIVE, payload }
      
      // act
      const result = frontPageReducer(initialState, action)

      // assert
      expect(result.isActive).toBe(false)
    })

  })

})