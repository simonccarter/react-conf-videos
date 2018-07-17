import 'rxjs'
import dataReducer, { 
  initialState,
  COPY_DATA
} from './data'

describe('data', () => {

  describe('reducer', () => {
    it('should return the intial state', () => {
      // arrange
      const action = {type: 'EEE'}

      // act
      const result = dataReducer(undefined, action)
      
      // expect
      expect(result).toBe(initialState)
    })

    it('should copy data to the slice', () => {
      // arrange
      const payload = initialState.merge({presenters: {'idx': {'name': 'lalala'}}})
      const action = {type: COPY_DATA, payload}
      
      // act
      const result = dataReducer(undefined, action)
      
      // expect
      expect(result).toEqual(payload)
    })
  })

})