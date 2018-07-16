import 'rxjs'
import * as Immutable from 'seamless-immutable'
import dataReducer, { 
  initialState,
  lowerCase,
  COPY_DATA, LOAD_DATA_END
} from './data'

describe('data', () => {

  describe('lowerCase', () => {
    it('should lowercase all chars', () => {
      // arrange
      const input = 'AAAAAAAA'
      const expectedResult = 'aaaaaaaa';

      // act
      const result = lowerCase(input)

      // assert
      expect(result).toEqual(expectedResult)
    })
  })

  describe('dataCopyEpic', () => {
    // it('should return the correct action', () => {
    // })
  })

  describe('reducer', () => {
    it('should return the intial state', () => {
      // arrange
      const action = {type: 'EEE'}

      // act
      const result = dataReducer(initialState, action)
      
      // expect
      expect(result).toBe(initialState)
    })

    it('should copy data to the slice', () => {
      // arrange
      const payload = initialState.merge({presenters: {'idx': {'name': 'lalala'}}})
      const action = {type: COPY_DATA, payload}
      
      // act
      const result = dataReducer(initialState, action)
      
      // expect
      expect(result).toEqual(payload)
    })
  })

})