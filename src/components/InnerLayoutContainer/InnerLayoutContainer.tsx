import * as cn from 'classnames';
import * as React from 'react';

import styles from './InnerLayoutContainer.scss';

type Props = {
  className?: string;
};

export const InnerLayoutContainer: React.FunctionComponent<Props> = props => (
  <div className={cn(styles.root, props.className)}>{props.children}</div>
);
