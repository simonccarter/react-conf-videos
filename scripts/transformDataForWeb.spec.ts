const fs = require('fs')
const { lowerCase, transformDataFromJson } = require('./transformDataForWeb')

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

describe('transformDataFromJson', () => {
  it('should match the snapshot', () => {
    // arrange
    const inputJSON = JSON.parse(fs.readFileSync('./scripts/testInput.json', 'utf8'))

    // act
    const result = transformDataFromJson(inputJSON)

    // assert
    expect(result).toMatchSnapshot()
  })
})