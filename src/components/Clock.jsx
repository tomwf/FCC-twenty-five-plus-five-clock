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

  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME)
  const [sessionTime, setSessionTime] = useState(DEFAULT_SESSION_TIME)
  const [hasStarted, setHasStarted] = useState(false)
  const timeLeft = useRef()
  const timer = useRef()
  const [isBreak, setIsBreak] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isLooping, setIsLooping] = useState(false)

  useEffect(() => {
    // Pause the timer
    if (!hasStarted) {
      //console.log('stopping')
      clearInterval(timer.current)
      // document.querySelector('.timer').classList.remove('active')
    }

    // Cycle between break time and session time when timer reaches 0
    if (isFinished) {
      //console.log('Finished')

      // Wait for beeping to finish before starting the next timer
      setHasStarted(false)
      setIsFinished(false)
      document.querySelector('.timer').classList.remove('active')
      setIsLooping(true)

      // Toggle between break time and session time
      if (!isBreak) {
        document.getElementById('timer-label').innerText = 'Break'
        timeLeft.current = { minute: breakTime, second: 0 }
        setIsBreak(true)
      } else {
        document.getElementById('timer-label').innerText = 'Session'
        timeLeft.current = { minute: sessionTime, second: 0 }
        setIsBreak(false)
      }
      //console.log({isBreak})
    }

    if (isLooping) {
      setIsLooping(false)
      //console.log('starting another round')
      handleStartStop()
    }
  })

  function addLeadingZero(time) {
    return time < 10 ? '0' + time : time
  }

  function decreaseBreakTime() {
    // Prevent user from setting break length when the countdown has started
    if (hasStarted) return
    // Clear the countdown when setting session time
    if (timeLeft.current) {
      // clearInterval(timer.current)
      timeLeft.current = undefined
    }
    // Prevent user from setting break length below 1
    if (breakTime > 1) {
      setBreakTime(breakTime - 1)
      document.getElementById('break-length').innerText = breakTime - 1
      // Reset display
      document.getElementById('timer-label').innerText = 'Session'
      document.getElementById('time-left').innerText = `${addLeadingZero(sessionTime)}:00`
      setIsBreak(false)
    }
  }

  function increaseBreakTime() {
    // Prevent user from setting break length when the countdown has started
    if (hasStarted) return
    // Clear the countdown when setting session time
    if (timeLeft.current) {
      // clearInterval(timer.current)
      timeLeft.current = undefined
    }
    // Prevent user from setting break length above 60
    if (breakTime < 60) {
      setBreakTime(breakTime + 1)
      document.getElementById('break-length').innerText = breakTime + 1
      // Reset display
      document.getElementById('timer-label').innerText = 'Session'
      document.getElementById('time-left').innerText = `${addLeadingZero(sessionTime)}:00`
      setIsBreak(false)
    }
  }

  function decreaseSessionTime() {
    // Prevent user from setting session length when the countdown has started
    if (hasStarted) return
    // Clear the countdown when setting session time
    if (timeLeft.current) {
      // clearInterval(timer.current)
      timeLeft.current = undefined
    }

    // Prevent user from setting session length below 1
    if (sessionTime > 1) {
      setSessionTime(sessionTime - 1)
      document.getElementById('session-length').innerText = sessionTime - 1
      document.getElementById('time-left').innerText = `${addLeadingZero(sessionTime - 1)}:00`
    }
  }

  function increaseSessionTime() {
    // Prevent user from setting session length when the countdown has started
    if (hasStarted) return
    // Clear the countdown when setting session time
    if (timeLeft.current) {
      // clearInterval(timer.current)
      timeLeft.current = undefined
    }
    // Prevent user from setting session length above 60
    if (sessionTime < 60) {
      setSessionTime(sessionTime + 1)
      document.getElementById('session-length').innerText = sessionTime + 1
      document.getElementById('time-left').innerText = `${addLeadingZero(sessionTime + 1)}:00`
    }
  }

  function handleStartStop() {

    // Toggle start / stop
    setHasStarted(!hasStarted)
    document.querySelector('.timer').classList.add('active')

    // Prevent new countdown from starting if already started
    if (hasStarted) {
      //console.log('Already running skipping new countdown')
      return
    }

    //console.log('starting')

    // // Update timer label
    // if (isBreak) {
    //   document.getElementById('timer-label').innerText = 'Break'
    // } else {
    //   document.getElementById('timer-label').innerText = 'Session'
    // }

    const startDate = new Date()
    const startTime = startDate.getTime()
    let endTime

    // if (isBreak) {
    //   //console.log('Break time: ' + breakTime)
    //   targetTime = breakTime
    // } else {
    //   //console.log('Session time: ' + sessionTime)
    //   targetTime = sessionTime
    // }

    // Starting timer 
    if (!timeLeft.current) {
      let targetTime
      if (isBreak) {
        //console.log('Break time: ' + breakTime)
        targetTime = breakTime
      } else {
        //console.log('Session time: ' + sessionTime)
        targetTime = sessionTime
      }
      endTime = startTime + (targetTime * 1000 * 60) + 1000
      // endTime = startTime + (targetTime * 1000) // For testing
    } else {
      endTime = startTime + (timeLeft.current.minute * 1000 * 60) + (timeLeft.current.second * 1000) + 1000
      // endTime = startTime + (timeLeft.current.minute * 1000) // For testing
    }

    timer.current = setInterval(() => {
      const now = new Date().getTime()
      const elapsedTime = endTime - now
      const minute = Math.floor((elapsedTime / (1000 * 60)) % 60)
      // const second = Math.floor((elapsedTime / 1000) % 60) + 1
      const second = Math.floor((elapsedTime / 1000) % 60)

      // Update time left variable
      timeLeft.current = { minute: minute, second: second }
      // timeLeft.current = { minute: 0, second: targetSecond -= 1 }
      console.log(second)

      //console.log(timeLeft.current)
      document.getElementById('time-left').innerText = `${addLeadingZero(timeLeft.current.minute)}:${addLeadingZero(timeLeft.current.second)}`

      // When countdown reaches 0
      if (timeLeft.current.minute <= 0 && timeLeft.current.second <= 0) {
        document.getElementById('time-left').innerText = '00:00'
        //console.log('reached 0')
        clearInterval(timer.current)
        beep()

        setIsFinished(true)
        //console.log('done')
      }
    }, 1000)
  }

  function handleReset() {
    setBreakTime(DEFAULT_BREAK_TIME)
    setSessionTime(DEFAULT_SESSION_TIME)
    // setIsBreak(false)
    document.getElementById('beep').load()

    // Make the test happy happy
    document.getElementById('break-length').innerText = DEFAULT_BREAK_TIME
    document.getElementById('session-length').innerText = DEFAULT_SESSION_TIME
    document.getElementById('timer-label').innerText = 'Session'
    document.getElementById('time-left').innerText = '25:00'
    setIsBreak(false)

    if (timeLeft.current) {
      setHasStarted(false)
      document.querySelector('.timer').classList.remove('active')
      clearInterval(timer.current)
      timeLeft.current = { minute: DEFAULT_SESSION_TIME, second: 0 }

      document.getElementById('time-left').innerText = '25:00'
    }
  }

  function beep() {
    document.getElementById('beep').play()
  }

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
            <span id="session-length">25</span>
            <button id="session-increment" onClick={increaseSessionTime}><FaArrowUp /></button>
          </div>
        </div>
      </div>
      <div className="timer">
        <p id="timer-label">Session</p>
        <p id="time-left">25:00</p>
        <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
      <div className="controls">
        <button id="start_stop" onClick={handleStartStop}><FaPlay /><FaPause /></button>
        <button id="reset" onClick={handleReset}><FaSyncAlt /></button>
      </div>
    </div>
  )
}

export default Clock
