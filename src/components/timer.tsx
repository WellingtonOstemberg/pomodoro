import React from 'react'
import { secondsToTime } from '../utils/seconds-to-time'

interface TimerProps {
  mainTime: number
}

export default function Timer(props: TimerProps) {
  return <div className="timer">{secondsToTime(props.mainTime)}</div>
}
