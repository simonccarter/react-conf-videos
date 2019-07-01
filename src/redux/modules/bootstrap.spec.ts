import { ActionsObservable } from 'redux-observable';
import 'rxjs';
import { mockStore } from 'utils/test';

import bootstrapReducer, {
  boostrapEndRemoveLoaderEpic,
  BOOTSTRAP_COMPLETE_ACTIONS,
  BOOTSTRAP_END,
  BOOTSTRAP_END_LOADER,
  BOOTSTRAP_START,
  bootstrapEndEpic,
  initialState
} from './bootstrap';
import { LOAD_DATA_END } from './data';

describe('bootstrap reducer', () => {
  describe.skip('boostrapEndRemoveLoaderEpic', () => {
    it('should return the correct action', done => {
      // arrange
      const action$ = ActionsObservable.of({ type: BOOTSTRAP_END });

      // act
      boostrapEndRemoveLoaderEpic(action$, mockStore(), null).subscribe(
        action => {
          // assert
          expect(action.type).toBe(BOOTSTRAP_END_LOADER);
          expect(action.payload).toBeUndefined();
          done();
        }
      );
    });
  });

  describe('bootstrapEndEpic', () => {
    it('should return the correct action and payload', done => {
      // arrange
      const action$ = ActionsObservable.from(
        BOOTSTRAP_COMPLETE_ACTIONS.map(type => ({ type }))
      );

      // act
      bootstrapEndEpic(action$, mockStore(), null).subscribe(action => {
        // assert
        expect(action.type).toBe(BOOTSTRAP_END);
        expect(action.payload).toBeUndefined();
        done();
      });
    });
  });

  describe('reducer', () => {
    it('should return the initial state', () => {
      // act
      const result = bootstrapReducer(undefined, { type: 'EEE' });
      // assert
      expect(result).toEqual(initialState);
    });

    it('should set finished to false on BOOTSTRAP_START action', () => {
      // arrange
      const action = { type: BOOTSTRAP_START };
      // act
      const result = bootstrapReducer(undefined, action);
      // assert
      expect(result.finished).toBe(false);
    });

    it('should set finished to true on BOOTSTRAP_END action', () => {
      // arrange
      const action = { type: BOOTSTRAP_END };
      // act
      const result = bootstrapReducer(undefined, action);
      // assert
      expect(result.finished).toBe(true);
    });

    it('should set data on LOAD_DATA_END action', () => {
      // arrange
      const payload = 'some data';
      const error = true;
      const action = { type: LOAD_DATA_END, payload, error };

      // act
      const result = bootstrapReducer(undefined, action);

      // assert
      expect(result.finished).toBe(false);
      expect(result.data).toBe(payload);
      expect(result.error).toBe(error);
    });
  });
});
