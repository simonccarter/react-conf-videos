import * as React from 'react'
import { SearchInputInner } from './SearchInput'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

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
        blurRef={jest.fn()}
      />
    )
  }

  it('renders correctly', () => {
    const comp = shallowComp()
    expect(toJson(comp)).toMatchSnapshot()
  })

  it('renders correctly', () => {
    const comp = shallowComp()
    comp.find('.root').simulate('click')
    expect(mockFN).toHaveBeenCalled()
  })

})