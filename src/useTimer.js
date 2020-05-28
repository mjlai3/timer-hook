import { useEffect, useReducer } from 'react';
import { useInterval } from './useInterval';

const TIMER_TYPE = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT'
};

const defaultConfig = {
  interval: 1000,
  initialTime: 0,
  step: 1,
  endTime: null,
  type: TIMER_TYPE.INCREMENT,
  isPaused: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TICK':
      if (action.payload.type === TIMER_TYPE.INCREMENT) {
        return { ...state, time: state.time + Math.abs(action.payload.step) };
      }
      if (action.payload.type === TIMER_TYPE.DECREMENT) {
        return { ...state, time: state.time + -Math.abs(action.payload.step) };
      }
      return state;
    case 'SET_TIME':
      return { ...state, time: action.payload };
    case 'START':
      return { ...state, isPaused: false };
    case 'PAUSE':
      return { ...state, isPaused: true };
    case 'RESET':
      return { ...state, isPaused: true, time: state.initialTime };
    default:
      return state;
  }
};

export const useTimer = config => {
  const initialState = {
    ...defaultConfig,
    ...config,
    time: config.initialTime || defaultConfig.initialTime
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentConfig = {
    ...state,
    ...config
  };
  const { onEnd } = currentConfig;

  useInterval(
    () => {
      if (!state.isPaused) {
        dispatch({
          type: 'TICK',
          payload: {
            type: currentConfig.type,
            step: currentConfig.step
          }
        });
      }
    },
    state.isPaused ? null : currentConfig.interval
  );

  useEffect(() => {
    const endTime = parseInt(config.endTime, 10);
    const hasFinished = () =>
      (currentConfig.type === TIMER_TYPE.INCREMENT && state.time >= endTime) ||
      (currentConfig.type === TIMER_TYPE.DECREMENT && state.time <= endTime);
    if (!state.isPaused && hasFinished()) {
      dispatch({ type: 'PAUSE' });
      dispatch({ type: 'SET_TIME', payload: endTime });
      typeof onEnd === 'function' && onEnd();
    }
  }, [state.time, state.isPaused, config.endTime, currentConfig.type, onEnd]);

  const start = () => dispatch({ type: 'START' });
  const pause = () => dispatch({ type: 'PAUSE' });
  const reset = () => dispatch({ type: 'RESET' });

  return {
    time: state.time,
    start,
    pause,
    reset,
    isRunning: !state.isPaused
  };
};
