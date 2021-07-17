import { FourOFourPage } from 'components/Pages';
import React, { ComponentType } from 'react';
import { useRecoilValue } from 'recoil';
import { errorState } from 'state';

export const with404 =
  <P extends Record<string, unknown>>(
    Component: ComponentType<P>
  ): React.FC<P> =>
  (props) => {
    const error = useRecoilValue(errorState);

    return error.statusCode === 404 ? (
      <FourOFourPage />
    ) : (
      <Component {...props} />
    );
  };
