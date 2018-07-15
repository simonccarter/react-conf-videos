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
        blurRef={mockFN}
      />
    )
  }

  it('should render', () => {
    const comp = shallowComp()
    expect(toJson(comp)).toMatchSnapshot()
  })

  it('should call onKeyUpHandlers on onKeyUp with keyCode 13', () => {
    const comp = shallowComp()
    console.log(comp.find('.root').simulate)
    comp.find('.root').simulate('keyUp', {keyCode: 13})
    console.log('mockFN.mock.calls.length', mockFN.mock.calls.length)
    expect(mockFN).toHaveBeenCalled()
  })

})