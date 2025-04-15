import { useEffect, useRef } from 'react';

/**
 * Custom hook that calls a function repeatedly at a specified interval
 * @param {Function} callback Function to call 
 * @param {number} delay Time in ms, null to pause
 */
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;