import React, { useCallback, useEffect, useState } from 'react'
import { useInterval } from '../hooks/set-iterval'
import { secondsToTime } from '../utils/seconds-to-time'
import Button from './button'
import Timer from './timer'

interface PomodoroProps {
  pomodoroTime: number
  shortRestTime: number
  longRestTime: number
  cycles: number
}

export default function PomodoroTime(props: PomodoroProps): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime)
  const [timeCounting, setTimeCounting] = useState(false)
  const [working, setWorking] = useState(false)
  const [workingTime, setWorkingTime] = useState(0)
  const [resting, setResting] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [completedCycles, setCompletedCycles] = useState(0)
  const [pomodoros, setPomodoros] = useState(0)

  /* Play a sound */
  const finish = '../sounds/finish.mp3'
  const start = '../sounds/start.mp3'

  /* function to transform seconds in hour default */
  useInterval(
    () => {
      setMainTime(mainTime - 1)
      if (working) {
        setWorkingTime(workingTime + 1)
      }
    },
    timeCounting ? 1000 : null
  )

  /* configure the button to stop and start againg the mainTime */
  const pause = () => {
    if (!working && resting && timeCounting) {
      setTimeCounting(false)
    } else if (working && !resting && timeCounting) {
      setTimeCounting(false)
    } else if (working && !resting && !timeCounting) {
      setTimeCounting(true)
    } else if (!working && resting && !timeCounting) {
      setTimeCounting(true)
    }
  }

  /*  a function that represents a work moment */
  const configWork = useCallback(() => {
    const audioStartWorking = new Audio(start)
    setTimeCounting(true)
    setWorking(true)
    setResting(false)
    setMainTime(props.pomodoroTime)
    audioStartWorking.play()
  }, [props.pomodoroTime, setTimeCounting, setWorking, setResting, setMainTime])

  /*  a function that represents a rest moment */
  const configRest = useCallback(
    (long: boolean) => {
      const audioStopWorking = new Audio(finish)
      setTimeCounting(true)
      setWorking(false)
      setResting(true)
      if (long) {
        setMainTime(props.longRestTime)
      } else {
        setMainTime(props.shortRestTime)
      }
      audioStopWorking.play()
    },
    [
      props.longRestTime,
      props.shortRestTime,
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime
    ]
  )

  /* Add a class to change de background on the body page */
  useEffect(() => {
    if (working) document.body.classList.add('working')
    if (resting) document.body.classList.remove('working')

    if (mainTime > 0) return

    /* Count cycles, if it arrives at 3, we turn it back to 0 and restart the process */
    if (working && cycles === 3) {
      setCompletedCycles(completedCycles + 1)
      setPomodoros(pomodoros + 1)
      setCycles(0)
      configRest(true)
    } else if (working) {
      configRest(false)
      setCycles(cycles + 1)
      setPomodoros(pomodoros + 1)
      setWorking(false)
      setMainTime(props.shortRestTime)
    } else if (!working) {
      configWork()
    }
  }, [
    working,
    resting,
    mainTime,
    cycles,
    completedCycles,
    pomodoros,
    props.longRestTime,
    props.shortRestTime,
    configRest,
    configWork
  ])

  return (
    <div className="pomodoro">
      <h2>{working ? 'Você está trabalhando' : 'Você está descansando'}</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button
          style={working ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
          text="Start"
          onClick={() => configWork()}
        />
        <Button
          style={resting ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
          text="Rest"
          onClick={() => configRest(false)}
        />
        <Button
          style={{ minWidth: '90px' }}
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => pause()}
        />
      </div>
      <div className="details">
        <p>Cíclos concluídos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToTime(workingTime)}</p>
        <p>Pomodoros concluídos: {pomodoros}</p>
      </div>
    </div>
  )
}
