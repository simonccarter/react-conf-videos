
import * as React from 'react'

const AnimationShell = (Page: React.ComponentClass<{}>) => (props: any) => (
  <div>
    <Page {...props} transitionState={status} />
  </div>
)

export default AnimationShell
