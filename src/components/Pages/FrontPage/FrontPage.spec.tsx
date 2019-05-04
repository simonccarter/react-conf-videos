import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';

import { mockConference } from 'utils/test';
import { FrontPageInner } from './FrontPage';

describe('FrontPage', () => {
  describe('FrontPageInner', () => {
    const shallowComp = (isActive: boolean) =>
      shallow(
        <FrontPageInner
          conferences={{ x: mockConference() }}
          filterValue=""
          navigateToSearchURL={jest.fn()}
        />
      );

    it('should render', () => {
      // arrange
      // act
      const wrapper = shallowComp(true);

      // expect
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not have the isActive classes if isActive is false', () => {
      // arrange
      // act
      const wrapper = shallowComp(false);

      // assert
      expect(wrapper.find('.frontPage.isActive').length).toBe(0);
      expect(wrapper.find('.text.isActive').length).toBe(0);
    });
  });
});
