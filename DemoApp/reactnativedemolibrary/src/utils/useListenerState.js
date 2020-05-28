import {useState, useRef} from 'react';

function useListenerState(initialValue) {
  const [value, _setValue] = useState(initialValue);

  const valueRef = useRef(value);

  const setValue = val => {
    valueRef.current = val;
    _setValue(val);
  };

  return [valueRef, setValue];
}

export default useListenerState;
