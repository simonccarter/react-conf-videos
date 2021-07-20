import React from 'react';
import cn from 'classnames';
import { animated, useChain, useSpring } from 'react-spring/web.cjs'; // https://github.com/react-spring/react-spring/issues/552

import { Logo } from 'components';

import styles from './Header.scss';

type Props = {
  title: string;
  titleLink: string;
  tagline: string;
};

const transition = {
  from: { top: -100, opacity: 0 },
  to: { top: 0, opacity: 1 },
};

const Header: React.FunctionComponent<Props> = ({
  title,
  titleLink,
  tagline,
}) => {
  const titleRef = React.useRef(null);
  const taglineRef = React.useRef(null);
  const propsTitle = useSpring({ ...transition, ref: titleRef });
  const propsTagline = useSpring({ ...transition, ref: taglineRef });
  useChain([titleRef, taglineRef], [0, 0.2]);

  return (
    <header className={styles.header}>
      <Logo />
      <div className={styles.text}>
        <h1 className={styles.headerTitle}>
          <animated.a
            href={titleLink}
            className={styles.link}
            style={propsTitle}
          >
            {title}
          </animated.a>
        </h1>
        <animated.p className={styles.headerText} style={propsTagline}>
          {' '}
          {tagline}{' '}
        </animated.p>
        <p className={cn(styles.headerText, styles.contribute)}>
          Contribute
          <a
            className={styles.contributeLink}
            href="https://github.com/simonccarter/react-conf-videos"
            aria-label="Contribute at our github repo"
          >
            {' '}
            at our github repo
          </a>
          .
        </p>
      </div>
    </header>
  );
};

export default Header;
