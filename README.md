# timer-hook

Demo: https://codesandbox.io/s/timer-hook-example-ze88r

## Usage

```javascript
import React from 'react';
import { useTimer } from 'timer-hook';

const App = () => {
  const { time, start, pause, reset, isRunning } = useTimer();

  return (
    <>
      <div>Time: {time}</div>
      <div>
        <button onClick={start}>{isRunning ? 'Start' : 'Running'}</button>
        <button onClick={pause}>Pause</button>
        <button onClick={reset}>Reset</button>
      </div>
    </>
  );
};
```

## Configuration

All configurations are optional

| Property    | Type     | Default value | Description                                                                            |
| ----------- | -------- | ------------- | -------------------------------------------------------------------------------------- |
| endTime     | number   | null          | end time for the timer                                                                 |
| initialTime | number   | 0             | starting value for the timer                                                           |
| interval    | number   | 1000          | the interval between each tick in milliseconds                                         |
| onEnd       | function |               | callback function to run when timer is over                                            |
| step        | number   | 1             | the value to change by each tick                                                       |
| type        | string   | "INCREMENT"   | "INCREMENT" or "DECREMENT"                                                             |