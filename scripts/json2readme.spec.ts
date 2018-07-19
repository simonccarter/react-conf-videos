const fs = require('fs')
const { run } = require('./json2readme')

describe('json2reamd', () => {
  describe('run', () => {
    it('should match snapshot', () => {
      // arrange
      const inputJSON = JSON.parse(fs.readFileSync('./scripts/testInput.json', 'utf8'))

      // act
      const result = run(inputJSON)

      // assert
      expect(result).toMatchSnapshot()
    })
  })
})