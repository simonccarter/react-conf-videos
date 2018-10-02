
import * as React from 'React'
import { Header } from 'components'

const AnimationShell = (Page: React.ComponentClass<{}>) => (props: any) => (
  <div>
    <Header />
    <Page {...props} transitionState={status} />
  </div>
)

export default AnimationShell
