import * as cn from 'classnames';
import React from 'react';

import styles from './InnerLayoutContainer.scss';

type Props = {
  className?: string;
};

export const InnerLayoutContainer: React.FunctionComponent<Props> = (props) => (
  <main className={cn(styles.root, props.className)}>{props.children}</main>
);
