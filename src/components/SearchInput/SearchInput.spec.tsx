import * as React from 'react'
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import toJSON from 'enzyme-to-json'

import { shallowWithStore, mountWithStore } from 'utils'
import SearchInput, { SearchInputInner } from './SearchInput'

import { FILTER, SET_IS_ACTIVE } from '../../redux/modules/frontPage'

describe('SearchInputInner', () => {
  const mockFN = jest.fn()

  const shallowComp = () => {
    return shallow<any>(
      <SearchInputInner
        filterValue=''
        onInputChange={mockFN}
        onKeyUpHandlers={mockFN}
        setRef={mockFN}
        isActive={true}
        myRef={null}
        blurRef={mockFN}
      />
    )
  }

  it('should render', () => {
    const comp = shallowComp()
    expect(toJSON(comp)).toMatchSnapshot()
  })

  it('should call onKeyUpHandlers on onKeyUp with keyCode 13', () => {
    const comp = shallowComp()
    comp.find('.root').simulate('keyUp', {keyCode: 13})
    expect(mockFN).toHaveBeenCalled()
  })
})

describe('SearchInput', () => {
  
  it('should render and contain connected props', () => {
    // arrange
    const isActive = false
    const filterValue = ''
    const store = {frontPage: {isActive, filterValue}}

    // act
    const wrapper = shallowWithStore(store, <SearchInput />)

    // assert
    expect(toJSON(wrapper)).toMatchSnapshot()
    expect(wrapper.props().isActive).toEqual(isActive)
    expect(wrapper.props().filterValue).toEqual(filterValue)
  })

  it('should dispatch correct actions on change handler call', () => {
    // arrange
    const store = createMockStore({frontPage: {isActive: false, filterValue: ''}})
    const value = 'a search query'

    // act
    const wrapper = mountWithStore(store, <SearchInput />)
    wrapper.find('input').simulate('change', {target: { value}})

    // assert
    expect(toJSON(wrapper)).toMatchSnapshot()
    expect(store.isActionTypeDispatched(FILTER)).toBe(true)
    expect(store.isActionTypeDispatched(SET_IS_ACTIVE)).toBe(true)
  })

})