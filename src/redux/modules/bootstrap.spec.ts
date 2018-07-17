import 'rxjs'
import { onError, mockStore } from 'utils'
import { ActionsObservable } from 'redux-observable'
import { Action } from 'domain/Action'

import bootstrapReducer, { 
  BOOTSTRAP_START, BOOTSTRAP_END, 
  BOOTSTRAP_COMPLETE_ACTIONS, BOOTSTRAP_END_LOADER,
  initialState, bootstrapStartEpic, bootstrapEndEpic, 
  loadJSONDataEpic, boostrapEndRemoveLoaderEpic
} from './bootstrap'
import { LOAD_DATA_END, LOAD_DATA_START } from './data'

describe('bootstrap reducer', () => {

  describe('bootstrapStartEpic', () => {
    it('should return the correct action', (done) => {
      // arrange
      const action$ = ActionsObservable.of({type: BOOTSTRAP_START})

      // act
      bootstrapStartEpic(action$, mockStore(), null)
        .subscribe(
          (action: Action<any>) => {
            // assert
            expect(action.type).toBe(LOAD_DATA_START)
            done()
          },
          onError(done)
        )
    })
  })

  describe('loadJSONDataEpic', () => {
    it('should return the correct action and payload', (done) => {
      // arrange
      const payload = 'random data'
      const action$ = ActionsObservable.of({type: LOAD_DATA_START, payload})

      // act
      loadJSONDataEpic(action$, mockStore(), null)
        .subscribe(
          action => {
            // assert
            expect(action.type).toBe(LOAD_DATA_END)
            done()
          },
          onError(done)
        )
    })
  })

  describe('boostrapEndRemoveLoaderEpic', () => {
    it('should return the correct action', (done) => {
      // arrange 
      const action$ = ActionsObservable.of({type: BOOTSTRAP_END})

      // act
      boostrapEndRemoveLoaderEpic(action$, mockStore(), null)
        .subscribe(
          action => {
            // assert
            expect(action.type).toBe(BOOTSTRAP_END_LOADER)
            expect(action.payload).toBeUndefined()
            done()
          },
          onError(done)
        )
    })
  })

  describe('bootstrapEndEpic', () => {
    it('should return the correct action and payload', (done) => {
      // arrange
      const action$ = ActionsObservable.from(
        BOOTSTRAP_COMPLETE_ACTIONS.map(type => ({type}))
      )

      // act
      bootstrapEndEpic(action$, mockStore(), null)
        .subscribe(
          (action: Action<any>) => {
            // assert
            expect(action.type).toBe(BOOTSTRAP_END)
            expect(action.payload).toBeUndefined()
            done()
          },
          onError(done)
        )
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      // act
      const result = bootstrapReducer(undefined, {type: 'EEE'})
      // assert
      expect(result).toEqual(initialState)
    })

    it('should set finished to false on BOOTSTRAP_START action', () => {
      // arrange
      const action = {type: BOOTSTRAP_START}
      // act
      const result = bootstrapReducer(undefined, action)
      // assert
      expect(result.finished).toBe(false)
    })

    it('should set finished to true on BOOTSTRAP_END action', () => {
      // arrange
      const action = {type: BOOTSTRAP_END}
      // act
      const result = bootstrapReducer(undefined, action)
      // assert
      expect(result.finished).toBe(true)
    })

    it('should set data on LOAD_DATA_END action', () => {
      // arrange
      const payload = 'some data'
      const error = true
      const action = {type: LOAD_DATA_END, payload, error }

      // act
      const result = bootstrapReducer(undefined, action)

      // assert
      expect(result.finished).toBe(false)
      expect(result.data).toBe(payload)
      expect(result.error).toBe(error)
    })

  })

})

