import * as React from 'react';
import cn from 'classnames';
import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VideoTransformed } from 'domain/TransformedJSON';
import { Link } from 'react-router-dom';

import { sluggifyUrl } from 'utils/';

import styles from './Video.scss';

const Video = React.forwardRef<HTMLLIElement, { video: VideoTransformed }>(
  ({ video }, ref) => {
    const {
      title,
      length,
      embeddableLink,
      lightning = false,
      presenter,
      conference,
    } = video;
    const [isOpen, toggleIsOpen] = React.useState(false);

    return (
      <li className={styles.root} data-cy="result" ref={ref}>
        <h3 className={styles.heading}>
          <button
            id={`accordion-${title}`}
            className={styles.top}
            onClick={() => toggleIsOpen((open) => !open)}
            type="button"
            aria-expanded={isOpen}
            aria-controls={`content-${title}`}
          >
            <span className={styles.title}>
              {lightning && <FontAwesomeIcon icon={faBolt} color="#f5de1a" />}{' '}
              <span dangerouslySetInnerHTML={{ __html: title }} />
            </span>
            <span className={styles.right}>{length}</span>
          </button>
        </h3>
        <div
          id={`content-${title}`}
          data-testid={`content-${title}`}
          aria-labelledby={`accordion-${title}`}
          className={cn(styles.videoWrapper, { [styles.open]: isOpen })}
          aria-hidden={!isOpen}
        >
          {isOpen && (
            <iframe
              title="videoPlayer"
              id="ytplayer"
              width="410"
              height="360"
              src={embeddableLink}
              frameBorder="0"
              allowFullScreen
            />
          )}
        </div>
        <span className={styles.details}>
          <span dangerouslySetInnerHTML={{ __html: presenter }} />
          <Link
            to={{
              pathname: `/conference/${sluggifyUrl(conference?.title ?? '')}`,
              search: '',
            }}
            aria-label={`See all videos for conference ${conference?.title?.replace(
              /(<([^>]+)>)/gi,
              ''
            )}`}
            className={styles.conferenceTitle}
            data-cy="conference-link"
            dangerouslySetInnerHTML={{
              __html: conference?.title ?? '',
            }}
          />
        </span>
      </li>
    );
  }
);

export default Video;
