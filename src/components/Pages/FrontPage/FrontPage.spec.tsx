import * as React from 'react'
import { shallow } from 'enzyme'
import { shallowWithStore } from 'utils'
import FrontPage, { FrontPageInner } from './FrontPage'
import toJson from 'enzyme-to-json'

import { mockConference } from 'utils'

describe('FrontPage', () => {
  describe.skip('FrontPageInner', () => {

    const shallowComp = (isActive: boolean) => shallow<any>(
      <FrontPageInner
        conferences={{'x': mockConference()}}
        filterValue=''
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
      const store = {frontPage: {isActive: false}}

      // act
      const wrapper = shallowWithStore(store, <FrontPage />)

      // assert
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })
})