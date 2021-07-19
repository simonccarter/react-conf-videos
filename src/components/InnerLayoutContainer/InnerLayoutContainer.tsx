import cn from 'classnames';
import React from 'react';

import styles from './InnerLayoutContainer.scss';

type Props = {
  className?: string;
};

const InnerLayoutContainer: React.FC<Props> = ({ className, children }) => (
  <main className={cn(styles.root, className)}>{children}</main>
);

export default InnerLayoutContainer;
