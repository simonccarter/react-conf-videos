import 'rxjs'
import dataReducer, {
  transformDataFromJson,
  initialState,
  cleanString,
  COPY_DATA
} from './data'

const inputJSON = require('../../../scripts/testInput.json')

describe('data', () => {

  describe('reducer', () => {
    it('should return the intial state', () => {
      // arrange
      const action = { type: 'EEE' }

      // act
      const result = dataReducer(undefined, action)

      // expect
      expect(result).toBe(initialState)
    })

    it('should copy data to the slice', () => {
      // arrange
      const payload = initialState.merge({ presenters: { idx: { name: 'lalala' } } })
      const action = { type: COPY_DATA, payload }

      // act
      const result = dataReducer(undefined, action)

      // expect
      expect(result).toEqual(payload)
    })
  })

  describe('cleanString', () => {
    it('should lowercase all chars', () => {
      // arrange
      const input = 'AAAAAAAA'
      const expectedResult = 'aaaaaaaa';

      // act
      const result = cleanString(input)

      // assert
      expect(result).toEqual(expectedResult)
    })

    it('should lowercase & normalize all diacritical chars', () => {
      // arrange
      const input = 'ÄÖÜÑ'
      const expectedResult = 'aoun';

      // act
      const result = cleanString(input)

      // assert
      expect(result).toEqual(expectedResult)
    })
  })

  describe('transformDataFromJson', () => {
    it('should match the snapshot', () => {
      // arrange
      // act
      const result = transformDataFromJson(inputJSON)

      // assert
      expect(result).toMatchSnapshot()
    })
  })

})
