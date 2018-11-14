import * as React from 'React'

import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'

import Logo from './Logo'
import { wrapWithMemoryRouter } from 'utils'

describe('Logo', () => {
  it('should render', () => {
    // arrange
    // act
    const comp = mount(wrapWithMemoryRouter(<Logo />))

    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })
})
