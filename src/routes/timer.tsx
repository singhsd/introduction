import React, { useState, useEffect, ChangeEvent } from 'react';
import { toast } from "react-toastify";
import {ScoreCard, Select, Input, Period} from './helpers';

const getTimePeriod = (seconds: number) => {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let sec = Math.floor((seconds % 3600) % 60);
    return {
      hours,
      minutes,
      seconds: sec,
    };
  };

const formatSeconds = (seconds: number) => {
    let { hours, minutes, seconds: sec } = getTimePeriod(seconds);
  
    const strHours = hours.toString().padStart(2, "0");
    const strMinutes = minutes.toString().padStart(2, "0");
    const strSec = sec.toString().padStart(2, "0");
  
    if (strHours == "00" && strMinutes === "00") return `${strSec}`;
    if (strHours !== "00") return `${strHours}:${strMinutes}:${strSec}`;
  
    return `${strMinutes}:${strSec}`;
  };

export const Timer = () => {
    const [audio, setAudio] = useState<HTMLAudioElement | undefined>();
    const [endAudio, setEndAudio] = useState<HTMLAudioElement | undefined>();


    const [seconds, setSeconds] = useState<null | number>(null);
    const [workoutSeconds, setWorkoutSeconds] = useState(0);
    const [restSeconds, setRestSeconds] = useState(0);
    const [period, setPeriod] = useState<"workout" | "rest">("workout");
    
    const [workoutPeriod, setWorkoutPeriod] = useState<Period>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [restPeriod, setRestPeriod] = useState<Period>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [rounds, setRounds] = useState(1);
    const [roundsCompleted, setRoundsCompleted] = useState(0);
    const [editWorkout, setEditWorkout] = useState(true);
    const [timerState, setTimerState] = useState<"stopped" | "running">("stopped");

    const [subSections, setSubSections] = useState(1);
    const [currentSubSection, setCurrentSubSection] = useState(1);

    useEffect(() => {
      setAudio(new Audio("/beep.mp3"));
      setEndAudio(new Audio("/beep.mp3"));
    }, []);

    useEffect(() => {
        let interval: undefined | NodeJS.Timeout  = undefined;
        // if (seconds && (seconds === 3 || seconds ===2 || seconds === 1) && timerState == "running") {
        //   if (audio !== undefined) {audio.play();}
        // } 
        if (timerState == "running" && seconds) {
            interval = setInterval(() => {
                setSeconds(seconds-1);
            }, 1000);
        } else if (timerState === "stopped") {
            clearInterval(interval);
        } else if (seconds === 0) {
          if (audio !== undefined) {audio.play();}
          if (period === "rest") {
            setPeriod("workout")
            setCurrentSubSection(1)
            if (roundsCompleted === rounds) {
              setTimerState("stopped")
              return clearInterval(interval)
            }
            return setSeconds(workoutSeconds)
          }
          if (currentSubSection == subSections) {
            // round is over
            // check if it was last round
            if (roundsCompleted == rounds - 1) {
              setTimerState("stopped")
              return clearInterval(interval)
            } else {
              // round is over, head over to rest
              setPeriod("rest")
              setCurrentSubSection(1)
              setRoundsCompleted(roundsCompleted+1)
              return setSeconds(restSeconds)
            }
          } else if (currentSubSection < subSections) {
            // section is over
            setCurrentSubSection(currentSubSection+1)
            return setSeconds(workoutSeconds)
          }
        }
        return () => clearInterval(interval)
    }, [timerState, seconds]);

    const startOrStopTimer = () => {
        if(seconds === 0) {
            resetTimer();
            return setTimerState("running");
        }
        if (timerState === "stopped") return setTimerState("running");
        setTimerState("stopped");
    }

    const resetTimer = () => {
        setTimerState("stopped");
        setSeconds(workoutSeconds);
        setPeriod("workout");
        setRoundsCompleted(0);
        setSubSections(1)
    };

    const handlePeriodChange = (
      e: ChangeEvent<HTMLSelectElement>,
      type: "workout" | "rest",
      unit: keyof Period
    ) => {
        const val = Number(e.target.value);

        if (type === "workout") {
        const prevTimes = { ...workoutPeriod };
        prevTimes[unit] = val;

        const workoutTimeInSeconds =
            prevTimes.hours * 3600 + prevTimes.minutes * 60 + prevTimes.seconds;

        setWorkoutSeconds(workoutTimeInSeconds);
        return setWorkoutPeriod(prevTimes);
        }

        const prevTimes = { ...restPeriod };
        prevTimes[unit] = val;

        const restTimeInSeconds =
        prevTimes.hours * 3600 + prevTimes.minutes * 60 + prevTimes.seconds;

        setRestSeconds(restTimeInSeconds);
        return setRestPeriod(prevTimes);
    };

    const handleRoundsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRounds(Number(e.target.value));
    }

    const handleGetStarted = () => {
        let problems = "";
        if (restSeconds < 1)
          problems += "Please enter a rest time greater than 0. ";
        if (workoutSeconds < 1)
          problems += "Please enter a workout time greater than 0. ";
        if (rounds < 1) problems += "Please make timer rounds more than 0. ";
    
        if (problems !== "") return showToastError(problems);
    
        setSeconds(workoutSeconds);
        setEditWorkout(false);
        // If the user edits mid way through or something like that we'll make them restart
        if (period === "rest") setPeriod("workout");
        setRoundsCompleted(0);
      };

      return (
        <div  style={divStyle}>
          {rounds > 0 && workoutSeconds > 0 && !editWorkout && (
            <ScoreCard
              items={[
                { title: "Rounds", body: rounds },
                { title: "Workout", body: formatSeconds(workoutSeconds) },
                { title: "Sub Sections per Round", body: subSections },
                { title: "Rest", body: formatSeconds(restSeconds) },
              ]}
            />
          )}
    
          <div style={{padding: "10px"}}>
            {editWorkout ? (
              <div>
                <h3>Workout Time</h3>
                <div>
                  <Select
                    options={Array.from({ length: 24 }, (_, i) => i)}
                    label="Hours"
                    onChange={(e) => handlePeriodChange(e, "workout", "hours")}
                    value={workoutPeriod.hours}
                    selectClassName="sm:w-24"
                  />
                  <Select
                    options={Array.from({ length: 60 }, (_, i) => i)}
                    label="Minutes"
                    onChange={(e) => handlePeriodChange(e, "workout", "minutes")}
                    value={workoutPeriod.minutes}
                    selectClassName="sm:w-24"
                  />
                  <Select
                    options={Array.from({ length: 60 }, (_, i) => i)}
                    label="Seconds"
                    onChange={(e) => handlePeriodChange(e, "workout", "seconds")}
                    value={workoutPeriod.seconds}
                    selectClassName="sm:w-24"
                  />
                  <Select
                    options={Array.from({ length: 10 }, (_, i) => i)}
                    label="Sections Per Round"
                    onChange={(e) => {
                      if (e.target.value === "0") {
                        setSubSections(1);
                      }
                      setSubSections(parseInt(e.target.value));
                    }}
                    value={subSections}
                    selectClassName="sm:w-24"
                  />
                </div>
    
                <h3>Rest Time</h3>
                <div>
                  <Select
                    options={Array.from({ length: 24 }, (_, i) => i)}
                    label="Hours"
                    onChange={(e) => handlePeriodChange(e, "rest", "hours")}
                    value={restPeriod.hours}
                    selectClassName="sm:w-24"
                  />
                  <Select
                    options={Array.from({ length: 60 }, (_, i) => i)}
                    label="Minutes"
                    onChange={(e) => handlePeriodChange(e, "rest", "minutes")}
                    value={restPeriod.minutes}
                    selectClassName="sm:w-24"
                  />
                  <Select
                    options={Array.from({ length: 60 }, (_, i) => i)}
                    label="Seconds"
                    onChange={(e) => handlePeriodChange(e, "rest", "seconds")}
                    value={restPeriod.seconds}
                    selectClassName="sm:w-24"
                  />
                </div>
    
                <Input
                  type="number"
                  label="Rounds"
                  placeholder="Rounds"
                  min={1}
                  value={rounds <= 0 ? undefined : rounds}
                  onChange={handleRoundsChange}
                />
    
                <button
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div>
                <div>
                  <div>
                    {seconds != null ? (
                      <div>
                        <div style={{display:"flex", justifyContent:"center"}}>
                          {formatSeconds(seconds)}
                        </div>
                        <p>
                          Mode: {period} {period === "workout" ? (<div>SubSection : {currentSubSection}</div>) : (<div></div>)}
                        </p>
                        <p>
                          Rounds Left: {rounds - roundsCompleted}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
    
                <div style={{display:"flex", justifyContent:"center"}}>
                  <button onClick={startOrStopTimer} style={{marginRight:"10px"}}>
                    {timerState !== "running" ? "Start" : "Stop"}
                  </button>
                  <button onClick={resetTimer}>
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
    
          {rounds > 0 && workoutSeconds > 0 && !editWorkout && (
            <div style={{padding: "10px", display:"flex", justifyContent:"center"}}>
              <button
                onClick={() => setEditWorkout(true)}
              >
                Edit Workout
              </button>
            </div>
          )}
        </div>
      );
}

const showToastError = (text: string) => {
    toast.error(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

const divStyle = {
  color: "black",
  padding: "10px",
  fontFamily: "cursive",
  paddingLeft:"30%",
  paddingRight:"30%",
  display: "block",
};