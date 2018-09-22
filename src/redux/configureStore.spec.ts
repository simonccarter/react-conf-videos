import 'rxjs'
import configureStore from './configureStore'

describe('configureStore', () => {
  it('should return a store object on call', () => {
    // act
    const store = configureStore()

    expect(store.hasOwnProperty('getState')).toBe(true)
    expect(store.hasOwnProperty('dispatch')).toBe(true)
    expect(store.hasOwnProperty('subscribe')).toBe(true)
    expect(store.hasOwnProperty('replaceReducer')).toBe(true)
  })
})