const { lowerCase } = require('./transformDataForWeb')

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