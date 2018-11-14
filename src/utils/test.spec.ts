import { mockStore } from './test'

describe('utils/test', () => {
  describe('mockStore', () => {
    it('should return a mockStore', () => {
      // arrange
      // act
      const result = mockStore()

      // assert
      expect(result).toHaveProperty('dispatch')
      expect(result).toHaveProperty('getState')
    })
  })
})
