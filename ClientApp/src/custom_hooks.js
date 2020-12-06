import { useState } from 'react'
import { isUndefined } from './utils'

export const useText = (initValue, onEnter, clearValueOnEnter) => {
  initValue = initValue || ''
  if (isUndefined(clearValueOnEnter)) {
    clearValueOnEnter = true
  }

  const [value, setValue] = useState(initValue)
  const [isCancelActive, setCancelActive] = useState(initValue.length > 0)

  function handleOnChange(evt) {
    const newValue = evt.target.value
    setValue(newValue)

    if (evt.key === 'Enter') {
      if (value.trim().length > 0) onEnter(value)
      if (clearValueOnEnter) setValue('')
    } else {
      setValue(newValue)
    }
    setCancelActive(newValue.length > 0)
  }

  function handleCancelClick() {
    setValue('')
    setCancelActive(false)
    onEnter('')
  }

  return {
    value,
    setValue,
    handleOnChange,
    isCancelActive,
    setCancelActive,
    handleCancelClick,
  }
}
