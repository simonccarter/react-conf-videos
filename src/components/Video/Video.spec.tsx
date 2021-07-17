import React from 'react';

import {
  fireEvent,
  mockConference,
  mockVideo,
  render,
  screen,
  waitFor,
} from 'utils/test';
import { VideoInner } from './Video';
import { ConferenceTransformed } from '../../domain/TransformedJSON';

describe('Video', () => {
  const getData = () => {
    const video = mockVideo();
    const conference: ConferenceTransformed = mockConference();
    const presenter = { name: 'Simon Carter' };

    const props = {
      videoId: 'xxx',
      conferenceId: 'yyy',
      video,
      presenter,
      conference,
    };
    return { props };
  };

  it('should render', () => {
    // arrange
    const { props } = getData();

    // act
    render(<VideoInner {...props} />);

    expect(screen.getByRole('listitem'));
  });

  it('should show and hide the video on click', async () => {
    // arrange
    const { props } = getData();

    // act
    render(<VideoInner {...props} />);

    fireEvent(
      screen.getByRole('button'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    await waitFor(async () => {
      expect(screen.getByRole('listitem')).toContainElement(
        screen.getByTitle('videoPlayer')
      );

      fireEvent(
        screen.getByRole('button'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );

      await waitFor(() => {
        expect(screen.queryByTitle('videoPlayer')).toBeNull();
      });
    });
  });
});
