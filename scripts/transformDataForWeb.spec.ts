const fs = require('fs')
const { harmonizeString, transformDataFromJson } = require('./transformDataForWeb')

describe('harmonizeString', () => {
  it('should lowercase all chars', () => {
    // arrange
    const input = 'AAAAAAAA'
    const expectedResult = 'aaaaaaaa';

    // act
    const result = harmonizeString(input)

    // assert
    expect(result).toEqual(expectedResult)
  })

  it('should lowercase & normalize all diacritical chars', () => {
    // arrange
    const input = 'ÄÖÜÑ'
    const expectedResult = 'aoun';

    // act
    const result = harmonizeString(input)

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