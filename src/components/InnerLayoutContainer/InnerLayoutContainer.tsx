import * as React from 'react'
import * as cn from 'classnames'

import styles from './InnerLayoutContainer.scss'

type Props = {
  className?: string
}

const InnerLayoutContainer: React.SFC<Props> = props => (
  <div className={cn(styles.root, props.className)}>
    {props.children}
  </div>
)

export default InnerLayoutContainer