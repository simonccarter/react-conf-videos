import 'rxjs'
import configureStore from './configureStore'

describe('configureStore', () => {
  it('should return a store object on call', () => {
    // act
    const { store, history, rootReducer } = configureStore()

    // assert
    expect(store).toBeDefined()
    expect(history).toBeDefined()
    expect(rootReducer).toBeDefined()

    expect(store.hasOwnProperty('getState')).toBe(true)
    expect(store.hasOwnProperty('dispatch')).toBe(true)
    expect(store.hasOwnProperty('subscribe')).toBe(true)
    expect(store.hasOwnProperty('replaceReducer')).toBe(true)
  })
})
