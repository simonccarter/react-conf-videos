import * as React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { shallowWithStore, mockConference } from 'utils'
import FrontPage, { FrontPageInner } from './FrontPage'

describe('FrontPage', () => {
  describe('FrontPageInner', () => {

    const shallowComp = (isActive: boolean) => shallow(
      <FrontPageInner
        conferences={{x: mockConference()}}
        filterValue=""
        navigateToSearchURL={jest.fn()}
        onInputChange={() => null}
      />
    )

    it('should render', () => {
      // arrange
      // act
      const wrapper = shallowComp(true)

      // expect
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('should not have the isActive classes if isActive is false', () => {
      // arrange
      // act
      const wrapper = shallowComp(false)

      // assert
      expect(wrapper.find('.frontPage.isActive').length).toBe(0)
      expect(wrapper.find('.text.isActive').length).toBe(0)
    })
  })

  describe('FrontPage', () => {
    it('should render', () => {
      // arrange
      const store = {
        frontPage: {isActive: false},
        search: {
          conferences: {X: mockConference()},
          filterValue: ''
        }
      }

      // act
      const wrapper = shallowWithStore(store, <FrontPage />)

      // assert
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })
})
