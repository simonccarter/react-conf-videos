import * as React from 'react'
import * as cn from 'classnames'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, pure, withHandlers, withStateHandlers } from 'recompose'

import { Video as VideoProp, Presenter, Conference } from '../../domain'
import { conferencePageActions } from 'redux/modules'
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
  toggleIsOpen: (e: any) => State
}

type WithHandlers = { onConferenceClick: React.EventHandler<any> }

type ReduxState = {
  video: VideoProp
  conferenceId: string
  conference: Conference
  speaker: Presenter
  goToConfPage: typeof conferencePageActions.navigateToConferencePage
}

type CombinedProps = Props & State & ReduxState & StateHandlers & WithHandlers

export const VideoInner: React.SFC<CombinedProps> = ({
  video: { title, length, embeddableLink },
  speaker, videoId, conference, isOpen, toggleIsOpen, onConferenceClick, conferenceId
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
          allowFullScreen
        /> }
      </div>
      <div className={styles.details}>
        <span>{speaker.name}</span>
        <Link to={`/conference/${conferenceId}/${sluggifyUrl(conference.title)}`} onClick={onConferenceClick}>
          <span className={styles.conferenceTitle}>{conference.title}</span>
        </Link>
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
    conferenceId,
    conference,
    speaker,
    video
  }
}

const mapDispatchToProps = {
  goToConfPage: conferencePageActions.navigateToConferencePage
}

const Video = compose<CombinedProps, Props>(
  connect(mapStateToProps, mapDispatchToProps),
  pure,
  withStateHandlers({ isOpen: false }, {
    toggleIsOpen: ({ isOpen }) => () => ({ isOpen: !isOpen })
  }),
  withHandlers<ReduxState & StateHandlers, WithHandlers>({
    onConferenceClick: props => (e: any) => {
      e.preventDefault()
      props.goToConfPage(props.conferenceId)
    }
  })
)(VideoInner)

export { Video }
