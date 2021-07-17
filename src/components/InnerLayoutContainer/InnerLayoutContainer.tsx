import * as cn from 'classnames';
import * as React from 'react';

import styles from './InnerLayoutContainer.scss';

type Props = {
  className?: string;
};

const InnerLayoutContainer: React.FC<Props> = (props) => (
  <main className={cn(styles.root, props.className)}>{props.children}</main>
);

export default InnerLayoutContainer;
