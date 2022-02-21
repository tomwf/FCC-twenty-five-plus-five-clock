import { useState, useRef, useEffect } from 'react'
import {
  FaArrowUp,
  FaArrowDown,
  FaPlay,
  FaPause,
  FaSyncAlt
} from 'react-icons/fa'

const DEFAULT_BREAK_TIME = 5
const DEFAULT_SESSION_TIME = 25

const Clock = () => {

  function addLeadingZero(time) {
    return time < 10 ? '0' + time : time
  }

  function decreaseBreakTime() {
    // Prevent user from setting break length when the countdown has started
    if (hasStarted) return
    // Prevent user from setting break length below 1
    if (breakTime > 1) {
      setBreakTime(breakTime - 1)
      document.getElementById('break-length').innerText = breakTime - 1
    }
  }

  function increaseBreakTime() {
    // Prevent user from setting break length when the countdown has started
    if (hasStarted) return
    // Prevent user from setting break length above 60
    if (breakTime < 60) {
      setBreakTime(breakTime + 1)
      document.getElementById('break-length').innerText = breakTime + 1
    }
  }

  function decreaseSessionTime() {
    // Prevent user from setting session length when the countdown has started
    if (hasStarted) return
    // Stop the countdown and clear the remaining time
    if (timeLeft.current) {
      clearInterval(timer.current)
      timeLeft.current = null
    }
    // Prevent user from setting session length below 1
    if (sessionTime > 1) {
      setSessionTime(sessionTime - 1)
      document.getElementById('session-length').innerText = sessionTime - 1
      document.getElementById('time-left').innerText = `${sessionTime - 1}:00`
    }
  }

  function increaseSessionTime() {
    // Prevent user from setting session length when the countdown has started
    if (hasStarted) return
    // Stop the countdown and clear the remaining time
    if (timeLeft.current) {
      clearInterval(timer.current)
      timeLeft.current = null
    }
    // Prevent user from setting session length above 60
    if (sessionTime < 60) {
      setSessionTime(sessionTime + 1)
      document.getElementById('session-length').innerText = sessionTime + 1
      document.getElementById('time-left').innerText = `${sessionTime + 1}:00`
    }
  }

  function handleStartStop() {

    setHasStarted(!hasStarted)

    if (hasStarted) {
      console.log('timer already running')
      return
    }

    const startDate = new Date()
    const startTime = startDate.getTime()
    let endTime

    if (!timeLeft.current) {
      endTime = startTime + (sessionTime * 1000 * 60)
    } else {
      endTime = startTime + (timeLeft.current.minute * 1000 * 60) + (timeLeft.current.second * 1000)
    }

    timer.current = setInterval(() => {
      const now = new Date().getTime()
      const elapsedTime = endTime - now
      const minute = Math.floor((elapsedTime / (1000 * 60)) % 60)
      const second = Math.floor((elapsedTime / 1000) % 60)

      timeLeft.current = { minute: minute, second: second }

      document.getElementById('time-left').innerText = `${addLeadingZero(timeLeft.current.minute)}:${addLeadingZero(timeLeft.current.second)}`
    }, 1000)
  }

  function handleReset() {
    setBreakTime(DEFAULT_BREAK_TIME)
    setSessionTime(DEFAULT_SESSION_TIME)

    // Make the test happy happy
    // document.getElementById('break-length').innerText = DEFAULT_BREAK_TIME
    // document.getElementById('session-length').innerText = DEFAULT_SESSION_TIME
    // document.getElementById('time-left').innerText = '25:00'

    if (timeLeft.current) {
      setHasStarted(!hasStarted)
      clearInterval(timer.current)
      timeLeft.current = { minute: DEFAULT_SESSION_TIME, second: 0 }

      document.getElementById('time-left').innerText = '25:00'
    }
  }

  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME)
  const [sessionTime, setSessionTime] = useState(DEFAULT_SESSION_TIME)
  const [hasStarted, setHasStarted] = useState(false)
  const timeLeft = useRef()
  const timer = useRef()
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    console.log({hasStarted})
    if (!hasStarted) {
      console.log('stopping')
      clearInterval(timer.current)
    }

    // if (timeLeft.current.minute === 0 && timeLeft.current.second === 0) {
    //   setIsBreak(!isBreak)

    //   if (isBreak) {
    //    if (breakTime) {
    //      timeLeft.current = { minute: breakTime, second: 0 }
    //    }
    //    // play audio
    //   } else {
    //      timeLeft.current = { minute: sessionTime, second: 0 }
    //   // do smth
    //   }
    // }
  })

  return (
    <div className="clock">
      <h1>25 + 5 Clock</h1>
      <div className="break-session-container">
        <div className="break container">
          <div>
            <p id="break-label">Break Length</p>
          </div>
          <div className="increment-decrement-container">
            <button id="break-decrement" onClick={decreaseBreakTime}><FaArrowDown /></button>
            {/* <span id="break-length">{breakTime}</span> */}
            <span id="break-length">5</span>
            <button id="break-increment" onClick={increaseBreakTime}><FaArrowUp /></button>
          </div>
        </div>
        <div className="session container">
          <div>
            <p id="session-label">Session Length</p>
          </div>
          <div className="increment-decrement-container">
            <button id="session-decrement" onClick={decreaseSessionTime}><FaArrowDown /></button>
            {/* <span id="session-length">{sessionTime}</span> */}
            <span id="session-length">25</span>
            <button id="session-increment" onClick={increaseSessionTime}><FaArrowUp /></button>
          </div>
        </div>
      </div>
      <div className="timer">
        <p id="timer-label">Session</p>
        <p id="time-left">
          25:00
          {/* {timeLeft.current */}
          {/*   ? `${addLeadingZero(timeLeft.current.minute)}:${addLeadingZero(timeLeft.current.second)}` */}
          {/*   : `${sessionTime}:00` */}
          {/* } */}
          {/* {isBreak */}
          {/*   ? `${addLeadingZero(breakTime.minute)}:${addLeadingZero(breakTime.second)}` */}
          {/*   : `${addLeadingZero(sessionTime.minute)}:${addLeadingZero(sessionTime.second)}` */}
          {/* } */}
        </p>
      </div>
      <div className="controls">
        <button id="start_stop" onClick={handleStartStop}><FaPlay /><FaPause /></button>
        <button id="reset" onClick={handleReset}><FaSyncAlt /></button>
      </div>
    </div>
  )
}

export default Clock
