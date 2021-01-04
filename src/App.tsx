import React from 'react'
import PomodoroTime from './components/pomodoro-timer'

import './index.css'

function App() {
  return (
    <div className="App">
      <PomodoroTime
        pomodoroTime={1500}
        shortRestTime={300}
        longRestTime={600}
        cycles={4}
      />
    </div>
  )
}

export default App
