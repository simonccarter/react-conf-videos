import { MiddlewareAPI } from 'redux'

/** epics **/

// fails test of error cb of subcribe is called
export const onError = (done:(idx: any) => any) => (error: Error) => done(false)

// mock empty store object
export const mockStore = () => { return <MiddlewareAPI<void>>{} }