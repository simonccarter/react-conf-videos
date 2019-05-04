import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';

import { mockConference } from 'utils/test';

import { List } from './List';

describe('List', () => {
  it('should render', () => {
    // arrange
    const conf = mockConference();
    const props = {
      conferences: { yyy: conf }
    };

    // act
    const wrapper = shallow(<List {...props} />);

    // assert
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
