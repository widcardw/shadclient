import type { Component } from 'solid-js'

import ColorModer from './components/dark-theme/ColorModeProvider'
import LeftToolBar from './components/tool-bar/left-tool-bar'
import { Button } from './components/ui/button'

const App: Component = () => {
  return (
    <>
      <ColorModer>
        <LeftToolBar />
        <div style={{ 'flex-grow': 1 }}>
          Main Page
          <div class="i-teenyicons:android-outline" />
          <Button>Button</Button>
        </div>
      </ColorModer>
    </>
  )
}

export default App
