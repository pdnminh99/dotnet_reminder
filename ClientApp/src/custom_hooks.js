import { useState } from 'react'
import { isUndefined } from './utils'

export const useText = (initValue, onEnter, clearValueOnEnter) => {
  initValue = initValue || ''

  if (isUndefined(clearValueOnEnter)) {
    clearValueOnEnter = true
  }

  const [value, setValue] = useState(initValue)
  const [isCancelActive, setCancelActive] = useState(initValue.length > 0)

  // Note: Do not call set value on every key up. Call in handleOnChange instead.
  function handleOnKeyUp({ target, key }) {
    const { value } = target

    if (key === 'Enter') {
      if (value.trim().length > 0) {
        onEnter(value)
      }

      if (clearValueOnEnter) {
        setValue(initValue)
      }
    }
  }

  function handleOnChange({ target }) {
    const { value } = target

    if (value.trim().length === 0) {
      onEnter(initValue)
    }
    setValue(value)
    setCancelActive(value.trim().length > 0)
  }

  function handleCancelClick() {
    setValue(initValue)
    setCancelActive(false)
    onEnter(initValue)
  }

  return {
    value,
    setValue,
    handleOnKeyUp,
    handleOnChange,
    isCancelActive,
    setCancelActive,
    handleCancelClick,
  }
}
