import * as React from 'react'
import toJSON from 'enzyme-to-json'
import { mount } from 'enzyme'

import Header from './Header'
import { wrapWithMemoryRouter } from 'utils'

describe('Header', () => {
  it('should render', () => {
    // arrange
    // act
    const comp = mount(wrapWithMemoryRouter(<Header />))

    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })
})
