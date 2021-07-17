import * as React from 'react';
import { Header, InnerLayoutContainer, Meta } from 'components';

const FiveHundredPage: React.FC = () => (
  <div>
    <Meta title="Something went wrong" />
    <Header
      title="Something went wrong"
      titleLink=""
      tagline="Sorry, something didn't work"
    />
    <InnerLayoutContainer />
  </div>
);

export default FiveHundredPage;
