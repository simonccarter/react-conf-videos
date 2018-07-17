import * as React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import App from './app'

describe('app', () => {

  it('should render', () => {
    // arrange
    // act
    const comp = shallow(<App />)

    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })

})