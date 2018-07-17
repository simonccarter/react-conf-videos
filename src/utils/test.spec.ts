import { onError, mockStore } from './test'

describe('utils/test', () => {
  describe('onError', () => {
    it('should call the callback with the supplied Error', () => {
      // arrange 
      const err = new Error('fake error')
      const cb = jest.fn()

      // act 
      onError(cb)(err)

      // assert
      expect(cb.mock.calls.length).toBe(1)
      expect(cb.mock.calls[0][0]).toBe(false)
    })
  })

  describe('mockStore', () => {
    it('should return an empty object', () => {
      // arrange 
      // act 
      const result = mockStore()

      // assert
      expect(result).toEqual({})
    })
  })
})