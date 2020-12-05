import { useState } from 'react'

export const useText = initValue => {
  initValue = initValue || ''

  const [value, setValue] = useState(initValue)
  const [isCancelActive, setCancelActive] = useState(initValue.length > 0)

  function handleOnChange(evt) {
    const newValue = evt.target.value
    if (evt.key === 'Enter') setValue('')
    else setValue(newValue)
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
