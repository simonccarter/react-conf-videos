import { mockStore } from './test';

describe('utils/test', () => {
  describe('mockStore', () => {
    it('should contain empty object as state', () => {
      // arrange
      // act
      const result = mockStore();

      // assert
      expect(result).toHaveProperty('value');
      expect(result.value).toEqual({});
    });

    it('should contain object passed to it under value', () => {
      // arrange
      const mockState = {
        eee: 'eee',
        kkk: {
          v: 'v'
        }
      };
      // act
      const result = mockStore(mockState);

      // assert
      expect(result).toHaveProperty('value');
      expect(result.value).toEqual(mockState);
    });
  });
});
