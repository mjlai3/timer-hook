import { useState, useEffect, useRef, useCallback } from 'react';
import { useInterval } from './useInterval';

const TIMER_TYPE = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT'
};

const defaultConfigs = {
  interval: 1000,
  initialTime: 0,
  step: 1,
  endTime: null,
  type: TIMER_TYPE.INCREMENT,
  onEnd: () => { }
}

export const useTimer = (config) => {
  const { interval, initialTime, step, endTime, type, onEnd } = {
    ...defaultConfigs,
    ...config
  }
  const isInitialLoad = useRef(true);
  const [time, setTime] = useState(initialTime);
  const [delay, setDelay] = useState(null);
  const [shouldReset, setShouldReset] = useState(false);

  const isFinished = useCallback(() => {
    if (type === TIMER_TYPE.INCREMENT && endTime && time >= endTime) {
      return true;
    }
    if (type === TIMER_TYPE.DECREMENT && time <= (endTime || 0)) {
      return true;
    }
    return false;
  }, [type, endTime, time]);

  const isRunning = useCallback(() => delay !== null, [delay]);

  useEffect(() => {
    if (!isInitialLoad.current && isRunning() && !shouldReset && isFinished()) {
      onEnd();
    }
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [isRunning, onEnd, shouldReset, isFinished]);

  useEffect(() => {
    isFinished() && pause();
  }, [isFinished]);

  useEffect(() => {
    if (shouldReset) {
      setTime(initialTime);
      setShouldReset(false);
    }
  }, [initialTime, shouldReset]);

  useInterval(
    () => {
      if (type === TIMER_TYPE.INCREMENT) {
        endTime
          ? setTime(Math.min(time + step, endTime))
          : setTime(time + step);
      }
      if (type === TIMER_TYPE.DECREMENT) {
        setTime(Math.max(time - step, endTime || 0));
      }
    },
    isRunning() ? interval : null
  );

  const start = () => {
    !isFinished() && setDelay(1000);
  };

  const pause = () => {
    setDelay(null);
  };

  const reset = () => {
    pause();
    setShouldReset(true);
  };

  return {
    time,
    start,
    pause,
    reset,
    isRunning: isRunning()
  };
};
