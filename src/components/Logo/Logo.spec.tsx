import * as React from 'react'

import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { wrapWithMemoryRouter } from 'utils/test'
import { Logo } from './Logo'

describe('Logo', () => {
  it('should render', () => {
    // arrange
    // act
    const comp = mount(wrapWithMemoryRouter(<Logo />))

    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })
})
