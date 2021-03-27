import * as React from 'react';
import { render, screen } from 'utils/test';

import { ResultDetails } from './ResultDetails';

describe('ResultDetails', () => {
  it('should render', () => {
    // arrange
    const props = {
      numberOfVideos: 5,
      numberOfConferences: 13
    };

    // act
    render(<ResultDetails {...props} />);

    // assert
    expect(screen.getByText(props.numberOfVideos));
    expect(screen.getByText(props.numberOfConferences));
  });
});
