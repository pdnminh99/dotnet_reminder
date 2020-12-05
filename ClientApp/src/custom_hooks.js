import { useState } from 'react'

export const useText = (initValue, onEnter) => {
  initValue = initValue || ''

  const [value, setValue] = useState(initValue)
  const [isCancelActive, setCancelActive] = useState(initValue.length > 0)

  function handleOnChange(evt) {
    const newValue = evt.target.value
    setValue(newValue)

    if (evt.key === 'Enter') {
      if (value.trim().length > 0) onEnter(value)
      setValue('')
    } else setValue(newValue)
    setCancelActive(newValue.length > 0)
  }

  function handleCancelClick() {
    setValue('')
    setCancelActive(false)
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
