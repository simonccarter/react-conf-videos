import * as React from 'react'
import * as cn from 'classnames'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, pure, withStateHandlers } from 'recompose'

import { Video as VideoProp, Presenter, Conference } from '../../domain'
import { ApplicationState } from 'redux/modules'
import { sluggifyUrl } from 'utils'

import styles from './Video.scss'

type Props = {
  videoId: string
  conferenceId: string
}

type State = {
  isOpen: boolean
}

type StateHandlers = {
  toggleIsOpen: (e: React.MouseEvent<HTMLElement>) => State
}

type ReduxState = {
  conferenceId: string
  conference: Conference
  speaker: Presenter
  video: VideoProp
}

type CombinedProps = Props & State & ReduxState & StateHandlers

export const VideoInner: React.SFC<CombinedProps> = ({
  video: { title, length, embeddableLink },
  speaker, videoId, conference, isOpen, toggleIsOpen, conferenceId
}) => {
  return (
    <div className={styles.root} key={videoId} >
      <div className={styles.top} onClick={toggleIsOpen} >
        <span className={styles.title}>{title}</span>
        <span className={styles.right}>{length}</span>
      </div>
      <div className={cn(styles.videoWrapper, { [styles.open]: isOpen })}>
        {isOpen && <iframe
          title="videoPlayer"
          id="ytplayer"
          width="410"
          height="360"
          src={embeddableLink}
          frameBorder="0"
          allowFullScreen={true}
        /> }
      </div>
      <div className={styles.details}>
        <span>{speaker.name}</span>
        <Link to={`/conference/${conferenceId}/${sluggifyUrl(conference.title)}`}>
          <span className={styles.conferenceTitle}>{conference.title}</span>
        </Link>
      </div>
    </div>
  )
}

const mapStateToProps = (state: ApplicationState, props: Props) => {
  const { data: { videos, presenters, conferences } } = state
  const { videoId, conferenceId } = props
  const video = videos[videoId]
  const conference = conferences[conferenceId]
  const speaker = presenters[video.presenter]
  return {
    conferenceId,
    conference,
    speaker,
    video
  }
}

export const Video = compose<CombinedProps, Props>(
  connect(mapStateToProps),
  pure,
  withStateHandlers({ isOpen: false }, {
    toggleIsOpen: ({ isOpen }) => () => ({ isOpen: !isOpen })
  })
)(VideoInner)
