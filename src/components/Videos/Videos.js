import React from 'react'
import FlipMove from 'react-flip-move'
import Video from './Video'

class Videos extends React.Component {
  render() {
    const { videos } = this.props
    return (
      <React.Fragment>
        { videos.map(video => (<Video key={video} videoId={video} />)) }
      </React.Fragment>
    )
  }
} 

export default Videos
