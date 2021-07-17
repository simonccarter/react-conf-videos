import * as React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ScrollToTop from 'components/HOCS/ScrollToTop';
import {
  ConferenceTransformed,
  VideoTransformed,
} from '../domain/TransformedJSON';

export const mockVideo = (title = 'test title'): VideoTransformed => ({
  id: 'SOME_RANDOM_VIDEO_ID',
  link: 'a link',
  split: '',
  title: title || 'test title',
  length: '12:34',
  lightning: false,
  presenter: 'simon carter',
  embeddableLink: 'a link',
  conference: {
    date: 'XX/YY/ZZZ',
    title: 'react conf 2018',
    website: 'fake url',
    playlist: 'day 1',
  },
});

export const mockConference = (): ConferenceTransformed => ({
  date: 'XX/YY/ZZZ',
  title: 'react conf 2018',
  website: 'fake url',
  playlist: 'day 1',
  videos: [mockVideo('aaa'), mockVideo('bbb'), mockVideo('ccc')],
});

export const Providers: React.FC = ({ children }) => (
  <Router>
    <RecoilRoot>
      <ScrollToTop>{children}</ScrollToTop>
    </RecoilRoot>
  </Router>
);

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
export { customRender as render };
