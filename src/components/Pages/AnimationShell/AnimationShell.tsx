
import * as React from 'React'

const AnimationShell = (Page: React.ComponentClass<{}>) => (props: any) => (
  <div>
    <Page {...props} transitionState={status} />
  </div>
)

export default AnimationShell
