import * as React from 'react'
import * as cn from 'classnames'
import { connect } from 'react-redux'
import { compose, pure, withStateHandlers } from 'recompose'

import { Video as VideoProp, Presenter, Conference } from '../../domain'

import styles from './Video.scss'

type Props = {
  videoId: string
  conferenceId: string
}

type RecState = {
  isOpen: boolean
}

type StateHandlers = {
  toggleIsOpen: (e: any) => RecState
}

type RedState = {
  video: VideoProp
  conference: Conference
  speaker: Presenter
}

type CombinedProps = Props & RecState & RedState & StateHandlers

export const VideoInner: React.SFC<CombinedProps> = ({
  video, speaker, videoId, conference, isOpen, toggleIsOpen
}) => {
  const {
    title, length, link, embeddableLink
  } = video
  return (
    <div className={styles.root} key={videoId} >
      <div className={styles.top} onClick={toggleIsOpen} >
        <a className={styles.title} href={link}>{title}</a>
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
          allowFullScreen
        /> }
      </div>
      <div className={styles.details}>
        <span>{speaker.name}</span>
        <span>{conference.title}</span>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any, props: Props) => {
  const { data: { videos, presenters, conferences } } = state
  const { videoId, conferenceId } = props
  const video = videos[videoId]
  const conference = conferences[conferenceId]
  const speaker = presenters[video.presenter]
  return {
    video: videos[videoId],
    conference,
    speaker
  }
}

const Video = compose<CombinedProps, Props>(
  connect(mapStateToProps, null),
  pure,
  withStateHandlers({ isOpen: false }, {
    toggleIsOpen: ({ isOpen }) => () => ({ isOpen: !isOpen })
  })
)(VideoInner)

export { Video }
