import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import * as React from 'react'

import { wrapWithMemoryRouter } from 'utils/test'
import { Header } from './Header'

describe('Header', () => {
  it('should render', () => {
    // arrange
    // act
    const comp = mount(wrapWithMemoryRouter(<Header />))

    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })
})
