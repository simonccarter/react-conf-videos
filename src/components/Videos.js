import React from 'react'
import Video from './Video'

const Videos = ({ videos }) => videos.map(video => (<Video key={video} videoId={video} />))

export default Videos
