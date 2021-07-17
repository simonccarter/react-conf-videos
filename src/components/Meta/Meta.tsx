import * as React from 'react';

import { Helmet } from 'react-helmet';

type Props = {
  title: string;
  description?: string;
};

// eslint-disable-next-line import/prefer-default-export
const Meta: React.FunctionComponent<Props> = ({ title, description = '' }) => (
  <Helmet>
    {title !== '' && <title>{`${title} - `}React.js Videos</title>}
    <meta name="description" content={description} />
  </Helmet>
);

export default Meta;
